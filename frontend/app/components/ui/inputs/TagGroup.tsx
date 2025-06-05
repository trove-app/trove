import React from 'react';
import { cn } from '../utils/cn';
import { Tag, TagProps } from './Tag';

export interface TagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of tag data
   */
  tags: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  } & Partial<TagProps>>;
  /**
   * Whether tags are removable
   */
  removable?: boolean;
  /**
   * Callback when a tag is removed
   */
  onRemove?: (id: string) => void;
  /**
   * Whether tags are selectable
   */
  selectable?: boolean;
  /**
   * Selected tag IDs
   */
  selectedIds?: string[];
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (ids: string[]) => void;
  /**
   * Whether multiple tags can be selected
   */
  multiSelect?: boolean;
  /**
   * Default props to apply to all tags
   */
  tagProps?: Partial<TagProps>;
  /**
   * Gap between tags
   */
  gap?: 'sm' | 'md' | 'lg';
}

export const TagGroup = React.forwardRef<HTMLDivElement, TagGroupProps>(
  ({ 
    className,
    tags,
    removable = false,
    onRemove,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    multiSelect = false,
    tagProps,
    gap = 'md',
    ...props 
  }, ref) => {
    const handleTagClick = (id: string) => {
      if (!selectable || !onSelectionChange) return;

      if (multiSelect) {
        const newSelection = selectedIds.includes(id)
          ? selectedIds.filter(selectedId => selectedId !== id)
          : [...selectedIds, id];
        onSelectionChange(newSelection);
      } else {
        onSelectionChange(selectedIds.includes(id) ? [] : [id]);
      }
    };

    const handleTagRemove = (id: string) => {
      if (onRemove) {
        onRemove(id);
      }
    };

    const gapStyles = {
      sm: 'gap-1.5',
      md: 'gap-2',
      lg: 'gap-3',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap',
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {tags.map(({ id, label, icon, ...tagSpecificProps }) => (
          <Tag
            key={id}
            icon={icon}
            removable={removable}
            onRemove={() => handleTagRemove(id)}
            interactive={selectable}
            selected={selectedIds.includes(id)}
            onClick={() => handleTagClick(id)}
            {...tagProps}
            {...tagSpecificProps}
          >
            {label}
          </Tag>
        ))}
      </div>
    );
  }
);

TagGroup.displayName = 'TagGroup'; 