import { Input, Select, Tag, TagGroup, TagVariant } from '@/app/components/ui/inputs';
import { Heading } from '@/app/components/ui/typography';
import { useState } from 'react';

const fruitOptions = [
  { value: 'apple', label: '🍎 Apple' },
  { value: 'banana', label: '🍌 Banana' },
  { value: 'orange', label: '🍊 Orange' },
  { value: 'grape', label: '🍇 Grape' },
  { value: 'disabled', label: '🚫 Disabled Option', disabled: true },
];

// Example tags for showcase
const demoTags = [
  { id: '1', label: 'Default Tag' },
  { id: '2', label: '✨ Gold Tag', variant: 'gold' as TagVariant },
  { id: '3', label: '🪙 Brown Tag', variant: 'brown' as TagVariant },
  { id: '4', label: '✅ Success', variant: 'success' as TagVariant },
  { id: '5', label: '⚠️ Warning', variant: 'warning' as TagVariant },
  { id: '6', label: '❌ Error', variant: 'error' as TagVariant },
  { id: '7', label: 'ℹ️ Info', variant: 'info' as TagVariant },
  { id: '8', label: '📊 Metric', variant: 'metric' as TagVariant },
  { id: '9', label: '💡 Insight', variant: 'insight' as TagVariant },
  { id: '10', label: '✨ Nugget', variant: 'nugget' as TagVariant },
];

const filterTags = [
  { id: 'sql', label: 'SQL', variant: 'gold' as TagVariant },
  { id: 'metrics', label: 'Metrics', variant: 'metric' as TagVariant },
  { id: 'insights', label: 'Insights', variant: 'insight' as TagVariant },
  { id: 'charts', label: 'Charts', variant: 'brown' as TagVariant },
];

export default function InputsShowcase() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [removableTags, setRemovableTags] = useState(demoTags);

  const handleTagRemove = (id: string) => {
    setRemovableTags(tags => tags.filter(tag => tag.id !== id));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <Heading level={1}>Input Components</Heading>
      
      <div className="space-y-8">
        {/* Default Input */}
        <div>
          <Heading level={2} className="mb-4">Default Input</Heading>
          <Input 
            placeholder="Enter some text..." 
            label="Default Input"
            helperText="This is a helper text"
          />
        </div>

        {/* Input with Error */}
        <div>
          <Heading level={2} className="mb-4">Input with Error</Heading>
          <Input 
            placeholder="Enter some text..." 
            label="Error Input"
            isError
            error="This field is required"
          />
        </div>

        {/* Disabled Input */}
        <div>
          <Heading level={2} className="mb-4">Disabled Input</Heading>
          <Input 
            placeholder="This input is disabled" 
            label="Disabled Input"
            disabled
          />
        </div>

        {/* Default Select */}
        <div>
          <Heading level={2} className="mb-4">Default Select</Heading>
          <Select
            options={fruitOptions}
            label="Choose a fruit"
            placeholder="Select a fruit..."
            helperText="Pick your favorite fruit"
          />
        </div>

        {/* Select with Error */}
        <div>
          <Heading level={2} className="mb-4">Select with Error</Heading>
          <Select
            options={fruitOptions}
            label="Fruit Selection"
            placeholder="Select a fruit..."
            isError
            error="Please select a fruit"
          />
        </div>

        {/* Disabled Select */}
        <div>
          <Heading level={2} className="mb-4">Disabled Select</Heading>
          <Select
            options={fruitOptions}
            label="Disabled Selection"
            placeholder="Cannot select..."
            disabled
          />
        </div>

        {/* Tag Variants */}
        <div>
          <Heading level={2} className="mb-4">Tag Variants</Heading>
          <TagGroup
            tags={demoTags}
            gap="sm"
          />
        </div>

        {/* Interactive Tags */}
        <div>
          <Heading level={2} className="mb-4">Interactive Tags</Heading>
          <TagGroup
            tags={filterTags}
            selectable
            multiSelect
            selectedIds={selectedTags}
            onSelectionChange={setSelectedTags}
            gap="sm"
          />
        </div>

        {/* Removable Tags */}
        <div>
          <Heading level={2} className="mb-4">Removable Tags</Heading>
          <TagGroup
            tags={removableTags}
            removable
            onRemove={handleTagRemove}
            gap="sm"
          />
        </div>

        {/* Tag Sizes */}
        <div>
          <Heading level={2} className="mb-4">Tag Sizes</Heading>
          <div className="space-y-4">
            <Tag size="sm">Small Tag</Tag>
            <Tag size="md">Medium Tag</Tag>
            <Tag size="lg">Large Tag</Tag>
          </div>
        </div>
      </div>
    </div>
  )
} 