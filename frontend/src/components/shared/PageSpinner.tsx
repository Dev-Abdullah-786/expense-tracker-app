const PageSpinner = ({ color = "teal" }: { color?: string }) => (
  <div className="flex items-center justify-center h-64">
    <div
      className={`animate-spin w-12 h-12 border-4 border-${color}-500 border-t-transparent rounded-full`}
    />
  </div>
);

export default PageSpinner;
