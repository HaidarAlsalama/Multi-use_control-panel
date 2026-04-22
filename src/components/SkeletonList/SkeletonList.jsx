const SkeletonCard = () => (
  <div className="w-full max-w-[268px] mx-auto cursor-pointer group animate-pulse">
    <div className="w-full h-[100px] md:h-[150px] bg-gray-600 rounded-[25px]"></div>
    <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mt-3"></div>
  </div>
);

const SkeletonList = ({ number = 4, top = false }) => (
  <div className="grid">
    {top && (
      <div className="mb-4 h-11 rounded-md bg-gray-600 shadow-md animate-pulse"></div>
    )}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(number)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  </div>
);

export default SkeletonList;
