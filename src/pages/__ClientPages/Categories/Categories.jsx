import { useClientCategories } from "api/Client/category";
import Container from "components/ClientLayoutPages/Container/Container";
import NavigationCard from "components/ClientLayoutPages/NavigationCard/NavigationCard";
import NavigationCardContainer from "components/ClientLayoutPages/NavigationCard/NavigationCardContainer";
import SkeletonList from "components/SkeletonList/SkeletonList";
import useParam from "Hooks/useParam";
import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import InputSearch from "components/ClientLayoutPages/ClientInputField/InputsFilter";

export default function Categories() {
  const categoryId = useParam("categoryId");
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isSuccess: categoriesIsSuccess,
    isError: categoriesIsError,
  } = useClientCategories(categoryId);

  if (categoriesIsError) return null;

  return (
    <div className="w-full max-w-6xl mx-auto  bg-blue-500_ p-4 mb-4">
      <div className="text-white font-bold_ text-md md:text-xl flex gap-1 flex-wrap">
        <Link to={""} className="duration-200 hover:text-yellow-500">
          المنتجات
        </Link>
        {categoriesIsSuccess && (
          <NestedNavigation data={categories.data.navigate} />
        )}
      </div>
      {categories?.data?.currentCategory?.description && (
        <div className="bg-zinc-800 p-4 text-white rounded-md my-4">
          {categories.data.currentCategory.description}
        </div>
      )}

      <div className="mt-4 w-full">
        {categoriesIsLoading && <SkeletonList number={8} />}
        {categoriesIsSuccess && (
          <NavigationCardContainer>
            {categories.data.categories.map((category) => (
              <NavigationCard
                key={category.id}
                {...{ ...category, link: `?categoryId=${category.id}` }}
              />
            ))}
            {categories.data.products.map((product) => (
              <NavigationCard
                key={product.id}
                {...{
                  ...product,
                  link: `/my-account/product?productId=${product.id}`,
                }}
              />
            ))}
          </NavigationCardContainer>
        )}
      </div>
    </div>
  );
}

const NestedNavigation = ({ data }) => {
  if (!data) return null;

  return (
    <>
      <Link
        to={`?categoryId=${data.id}`}
        className="text-md duration-200 hover:text-yellow-500 flex gap-1 items-center"
      >
        <IoIosArrowBack className="text-yellow-500" />
        {data.name}
      </Link>
      {data.navigate && <NestedNavigation data={data.navigate} />}
    </>
  );
};
