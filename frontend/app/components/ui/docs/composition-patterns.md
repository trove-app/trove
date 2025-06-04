# 🧩 Component Composition Patterns

*How to combine Trove UI components for maximum flexibility and reusability*

---

## 🎯 Composition Philosophy

### Small, Focused Components
Build components that do one thing well and compose naturally together.

```tsx
// ✅ Good: Composable pieces
<Card>
  <Card.Header>
    <Heading size="lg">Data Insights</Heading>
    <Text variant="muted">Last updated 2 hours ago</Text>
  </Card.Header>
  <Card.Content>
    <DataTable data={insights} />
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">View Details</Button>
    <Button variant="outline">Export</Button>
  </Card.Footer>
</Card>

// ❌ Avoid: Monolithic components
<InsightCard 
  title="Data Insights"
  subtitle="Last updated 2 hours ago"
  data={insights}
  primaryAction="View Details"
  secondaryAction="Export"
  showExport={true}
  // ... 20+ props
/>
```

---

## 🏗️ Common Composition Patterns

### 1. Container + Content Pattern
```tsx
// Layout components provide structure
function DataExplorer() {
  return (
    <Container maxWidth="7xl">
      <div className={cn(layoutPatterns.spacing.lg, 'py-8')}>
        <Header />
        <MainContent />
        <Footer />
      </div>
    </Container>
  );
}
```

### 2. Compound Component Pattern
```tsx
// Components that work together as a family
function Card({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        'bg-card border border-border rounded-lg shadow-soft',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className, ...props }) {
  return (
    <div 
      className={cn('p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({ children, className, ...props }) {
  return (
    <div 
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

### 3. Render Props Pattern
```tsx
// Flexible data components
function DataLoader({ children, query }) {
  const { data, loading, error } = useQuery(query);
  
  return children({ data, loading, error });
}

// Usage
<DataLoader query={insightsQuery}>
  {({ data, loading, error }) => (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <InsightsTable data={data} />}
    </>
  )}
</DataLoader>
```

### 4. Slot Pattern
```tsx
// Components with flexible content areas
function PageLayout({ 
  header, 
  sidebar, 
  main, 
  footer,
  className 
}) {
  return (
    <div className={cn('min-h-screen grid grid-rows-[auto_1fr_auto]', className)}>
      <header className="border-b border-border">
        {header}
      </header>
      
      <div className="grid grid-cols-[250px_1fr] gap-6">
        <aside className="border-r border-border p-6">
          {sidebar}
        </aside>
        <main className="p-6">
          {main}
        </main>
      </div>
      
      <footer className="border-t border-border">
        {footer}
      </footer>
    </div>
  );
}
```

---

## 🎨 Styling Composition

### 1. Variant Composition
```tsx
// Combine variants for rich styling options
<Button 
  variant="primary" 
  size="lg"
  className="shadow-treasure" // Additional styling
>
  Find Treasure
</Button>

// Components can accept and merge variants
function ActionButton({ urgency, ...props }) {
  const variants = {
    low: 'bg-secondary-500',
    medium: 'bg-primary-500', 
    high: 'bg-destructive animate-pulse'
  };
  
  return (
    <Button 
      className={cn(variants[urgency])}
      {...props}
    />
  );
}
```

### 2. Theme Composition
```tsx
// Components inherit theme context
function ThemedSection({ theme = 'default', children }) {
  const themes = {
    default: 'bg-background text-foreground',
    treasure: 'bg-primary-50 text-primary-950 border-primary-200',
    muted: 'bg-muted text-muted-foreground',
  };
  
  return (
    <section className={cn(themes[theme], 'p-6 rounded-lg')}>
      {children}
    </section>
  );
}
```

### 3. Responsive Composition
```tsx
// Components adapt together responsively
function ResponsiveLayout({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {children}
    </div>
  );
}

// Usage - components automatically adapt
<ResponsiveLayout>
  <InsightCard />
  <MetricCard />
  <ChartCard />
</ResponsiveLayout>
```

---

## 🔄 State Composition

### 1. Shared State Pattern
```tsx
// Components share state through context
const DataContext = createContext();

function DataProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({});
  
  return (
    <DataContext.Provider value={{ selectedItems, setSelectedItems, filters, setFilters }}>
      {children}
    </DataContext.Provider>
  );
}

// Components consume shared state
function DataTable() {
  const { selectedItems, setSelectedItems } = useContext(DataContext);
  // ...
}

function FilterPanel() {
  const { filters, setFilters } = useContext(DataContext);
  // ...
}
```

### 2. Event Composition
```tsx
// Components communicate through events
function SearchableTable({ onSearch, onSelect, ...props }) {
  return (
    <div>
      <SearchInput 
        onSearch={onSearch}
        placeholder="Search data nuggets..."
      />
      <DataTable 
        onRowSelect={onSelect}
        {...props}
      />
    </div>
  );
}
```

---

## 🧪 Advanced Patterns

### 1. Higher-Order Components
```tsx
// Add common functionality to components
function withLoading(Component) {
  return function WithLoadingComponent({ loading, ...props }) {
    if (loading) {
      return <LoadingSpinner />;
    }
    return <Component {...props} />;
  };
}

// Usage
const LoadableTable = withLoading(DataTable);
```

### 2. Polymorphic Components
```tsx
// Components that can render as different elements
function Text({ as: Component = 'p', className, ...props }) {
  return (
    <Component 
      className={cn('text-foreground', className)}
      {...props}
    />
  );
}

// Usage
<Text as="h1" className="text-2xl font-bold">Heading</Text>
<Text as="span" className="text-sm">Caption</Text>
```

### 3. Forwarded Refs
```tsx
// Components that forward refs for composition
const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'border border-input rounded-lg px-3 py-2',
        'focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
      {...props}
    />
  );
});
```

---

## 📋 Composition Checklist

### ✅ Good Composition
- [ ] Components have single responsibility
- [ ] Props are minimal and focused
- [ ] Styling is composable via className
- [ ] Components work well together
- [ ] State is shared appropriately
- [ ] Responsive behavior is consistent

### ❌ Avoid These Patterns
- [ ] Components with too many props
- [ ] Hardcoded styling that can't be overridden
- [ ] Tight coupling between components
- [ ] Inconsistent prop naming
- [ ] Breaking responsive layouts

---

## 🎯 Real-World Examples

### Data Explorer Composition
```tsx
function DataExplorer() {
  return (
    <PageLayout
      header={<NavigationHeader />}
      sidebar={<FilterSidebar />}
      main={
        <div className={cn(layoutPatterns.spacing.lg)}>
          <SearchableTable 
            data={data}
            onSearch={handleSearch}
            onSelect={handleSelect}
          />
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      }
      footer={<AppFooter />}
    />
  );
}
```

### Insight Card Composition
```tsx
function InsightCard({ insight }) {
  return (
    <Card className="hover:shadow-treasure transition-shadow">
      <Card.Header>
        <div className={cn(layoutPatterns.flexBetween)}>
          <Heading size="md">{insight.title}</Heading>
          <StatusBadge status={insight.status} />
        </div>
      </Card.Header>
      
      <Card.Content>
        <Text variant="muted" className="mb-4">
          {insight.description}
        </Text>
        <MetricDisplay value={insight.value} trend={insight.trend} />
      </Card.Content>
      
      <Card.Footer>
        <div className={cn(layoutPatterns.flexBetween)}>
          <Text size="sm" variant="muted">
            Updated {insight.updatedAt}
          </Text>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
```

---

## 📚 Resources

- [React Composition Patterns](https://reactpatterns.com/)
- [Component Composition Guide](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Trove Component Library](../README.md)

---

*"Great components are like treasure chests - valuable on their own, but even more powerful when combined."* ✨ 