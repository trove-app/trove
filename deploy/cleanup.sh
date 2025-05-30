#!/bin/bash
set -euo pipefail

# Source environment variables if .env exists
if [[ -f .env ]]; then
    source .env
fi

# Default values
DAYS_OLD=${1:-7}  # Default to removing images older than 7 days
DRY_RUN=${2:-false}  # Default to actually performing the cleanup

# Function to format size
format_size() {
    local size=$1
    if [[ $size -ge 1073741824 ]]; then
        echo "$(bc <<< "scale=2; $size/1073741824")GB"
    elif [[ $size -ge 1048576 ]]; then
        echo "$(bc <<< "scale=2; $size/1048576")MB"
    elif [[ $size -ge 1024 ]]; then
        echo "$(bc <<< "scale=2; $size/1024")KB"
    else
        echo "${size}B"
    fi
}

# Function to get total size of images
get_images_size() {
    local total_size=0
    while read -r size; do
        total_size=$((total_size + size))
    done < <(docker image ls --format '{{.Size}}' | sed 's/GB/*1073741824/;s/MB/*1048576/;s/KB/*1024/;s/B//' | bc)
    echo "$total_size"
}

# Print current disk usage
echo "Current disk usage:"
df -h /var/lib/docker

# Print current images size
initial_size=$(get_images_size)
echo "Current images size: $(format_size "$initial_size")"

echo -e "\nStarting cleanup process..."

if [[ "$DRY_RUN" == "true" ]]; then
    echo "DRY RUN MODE - No changes will be made"
fi

# Stop and remove stopped containers
echo -e "\nRemoving stopped containers..."
if [[ "$DRY_RUN" == "true" ]]; then
    docker ps -a --filter "status=exited" --format "{{.Names}}"
else
    docker container prune -f
fi

# Remove dangling images
echo -e "\nRemoving dangling images..."
if [[ "$DRY_RUN" == "true" ]]; then
    docker images -f "dangling=true" --format "{{.Repository}}:{{.Tag}}"
else
    docker image prune -f
fi

# Remove old images
echo -e "\nRemoving images older than $DAYS_OLD days..."
if [[ "$DRY_RUN" == "true" ]]; then
    docker images --format "{{.Repository}}:{{.Tag}} {{.CreatedAt}}" | \
        awk -v days="$DAYS_OLD" '{ cmd="date -d \"" $2 " " $3 "\" +%s"; cmd | getline created; 
            if ((systime() - created) > (days * 86400)) print $1 }'
else
    docker image prune -a -f --filter "until=${DAYS_OLD}d"
fi

# Remove unused volumes
echo -e "\nRemoving unused volumes..."
if [[ "$DRY_RUN" == "true" ]]; then
    docker volume ls -f "dangling=true" --format "{{.Name}}"
else
    docker volume prune -f
fi

# Print space reclaimed
if [[ "$DRY_RUN" == "false" ]]; then
    final_size=$(get_images_size)
    space_saved=$((initial_size - final_size))
    
    echo -e "\nCleanup completed!"
    echo "Space saved: $(format_size "$space_saved")"
    echo "Final images size: $(format_size "$final_size")"
    echo -e "\nFinal disk usage:"
    df -h /var/lib/docker
else
    echo -e "\nDry run completed. Run without second argument to perform actual cleanup."
fi 