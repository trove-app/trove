# 📝 Form Components Usage Guide

*A comprehensive guide to using Trove's form components*

## Table of Contents
- [Input Components](#input-components)
  - [Basic Input](#basic-input)
  - [SearchInput](#searchinput)
  - [Select](#select)
  - [Tag & TagGroup](#tag--taggroup)
- [Common Patterns](#common-patterns)
- [Validation States](#validation-states)
- [Best Practices](#best-practices)

## Input Components

### Basic Input

The `Input` component is our foundational form element, supporting various types, sizes, and states.

```tsx
import { Input } from '../components/ui';

// Basic usage
<Input 
  label="Username"
  placeholder="Enter username"
  helperText="Must be at least 3 characters"
/>

// With validation states
<Input 
  label="Email"
  type="email"
  isError={!isValidEmail}
  error="Please enter a valid email"
/>

// Different sizes
<Input size="sm" placeholder="Small input" />
<Input size="md" placeholder="Medium input (default)" />
<Input size="lg" placeholder="Large input" />

// Number input with validation
<Input
  type="number"
  label="Age"
  min={0}
  max={120}
  isWarning={age > 100}
  helperText={age > 100 ? "Are you sure about that?" : undefined}
/>
```

### SearchInput

The `SearchInput` component extends the base Input with search-specific features.

```tsx
import { SearchInput } from '../components/ui';

// Basic usage
<SearchInput
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// With custom search icon
<SearchInput
  searchIcon={<CustomSearchIcon />}
  showClear={true}
  onClear={() => setSearchQuery('')}
/>

// In a form
<form onSubmit={handleSearch}>
  <SearchInput
    placeholder="Search tables and columns..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="mb-3"
  />
</form>
```

### Select

The `Select` component provides a styled dropdown menu with various options.

```tsx
import { Select } from '../components/ui';

// Basic usage
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ]}
  placeholder="Select a country"
/>

// With validation
<Select
  label="Database"
  options={databases}
  isError={!selectedDatabase}
  error="Please select a database"
  value={selectedDatabase}
  onChange={(e) => setSelectedDatabase(e.target.value)}
/>

// Disabled options
<Select
  options={[
    { value: 'read', label: 'Read', disabled: !hasReadPermission },
    { value: 'write', label: 'Write', disabled: !hasWritePermission }
  ]}
/>
```

### Tag & TagGroup

The `Tag` and `TagGroup` components are used for displaying and managing collections of items.

```tsx
import { Tag, TagGroup } from '../components/ui';

// Single tag
<Tag variant="gold">New Feature</Tag>

// Interactive tag group
<TagGroup
  tags={[
    { id: '1', label: 'id', variant: 'metric' },
    { id: '2', label: 'name', variant: 'insight' },
    { id: '3', label: 'email', variant: 'nugget' }
  ]}
  selectable
  multiSelect
  selectedIds={selectedColumns}
  onSelectionChange={setSelectedColumns}
/>

// Removable tags
<TagGroup
  tags={selectedFilters}
  removable
  onRemove={handleRemoveFilter}
  gap="sm"
/>
```

## Common Patterns

### Form Layout
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <Input
    label="Name"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  
  <Select
    label="Role"
    options={roleOptions}
    required
    value={role}
    onChange={(e) => setRole(e.target.value)}
  />
  
  <TagGroup
    label="Permissions"
    tags={permissionTags}
    selectable
    multiSelect
    selectedIds={selectedPermissions}
    onSelectionChange={setSelectedPermissions}
  />
  
  <div className="flex justify-end gap-3">
    <Button variant="outline" onClick={onCancel}>Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</form>
```

### Search with Filters
```tsx
<div className="space-y-3">
  <SearchInput
    placeholder="Search data..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  
  <div className="flex gap-2">
    <Select
      options={filterOptions}
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
      size="sm"
    />
    
    <TagGroup
      tags={activeFilters}
      removable
      onRemove={removeFilter}
      gap="sm"
    />
  </div>
</div>
```

## Validation States

All form components support the following validation states:
- `isError` - For invalid input
- `isSuccess` - For valid input
- `isWarning` - For potentially problematic input
- `isLoading` - For async validation

```tsx
// Example with all states
<div className="space-y-4">
  <Input
    label="Username"
    isError={errors.username}
    error={errors.username}
  />
  
  <Input
    label="Email"
    isSuccess={isEmailValid}
    helperText="Email is valid!"
  />
  
  <Input
    label="Password"
    type="password"
    isWarning={password.length < 8}
    helperText="Password should be at least 8 characters"
  />
  
  <Select
    label="Country"
    options={countries}
    isLoading={isLoadingCountries}
  />
</div>
```

## Best Practices

1. **Form Organization**
   - Group related fields together
   - Use consistent spacing between fields
   - Align labels and inputs consistently
   - Show validation messages immediately below the relevant field

2. **Validation**
   - Validate on blur for better UX
   - Show success states sparingly
   - Use warning states for preventive guidance
   - Provide clear, actionable error messages

3. **Accessibility**
   - Always use labels with form controls
   - Provide helper text for complex inputs
   - Ensure proper tab order
   - Use ARIA attributes when needed

4. **Responsive Design**
   - Use appropriate input sizes for different screens
   - Stack form elements on mobile
   - Adjust spacing for touch targets
   - Consider keyboard input on mobile

5. **Performance**
   - Debounce search inputs
   - Lazy load large option lists
   - Use controlled components judiciously
   - Implement form state management for complex forms

## Examples from Trove

### SQL Builder Form
```tsx
// Column selection
<TagGroup
  tags={columns.map(col => ({
    id: col.name,
    label: col.name,
    variant: col.isPrimary ? 'gold' : 'default'
  }))}
  selectable
  multiSelect
  selectedIds={selectedColumns}
  onSelectionChange={setSelectedColumns}
/>

// Table selection
<Select
  label="Table"
  options={tables.map(table => ({
    value: table.name,
    label: table.name
  }))}
  value={selectedTable}
  onChange={handleTableChange}
/>

// Search filter
<SearchInput
  placeholder="Filter columns..."
  value={columnFilter}
  onChange={(e) => setColumnFilter(e.target.value)}
/>
```

### DB Explorer Search
```tsx
<SearchInput
  placeholder="Search tables and columns..."
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="mb-3"
/>
```

Remember to follow Trove's design principles:
- Use warm, inviting colors
- Provide clear feedback
- Keep interactions simple and intuitive
- Add delightful touches where appropriate 