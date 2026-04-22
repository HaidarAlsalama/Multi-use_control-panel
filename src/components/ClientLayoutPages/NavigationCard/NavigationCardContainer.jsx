export default function NavigationCardContainer({ children }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5_ gap-4">
      {children}
    </div>
  );
}
