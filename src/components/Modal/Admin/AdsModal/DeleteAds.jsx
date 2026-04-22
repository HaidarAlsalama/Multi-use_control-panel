import { useAdsById, useDeleteAds } from "api/admin/ads";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteAds({ isOpen, toggle, adsId }) {
  const {
    data: currentAds,
    isLoading: currentAdsIsLoading,
    isError: currentAdsIsError,
  } = useAdsById(adsId);

  const {
    mutate: deleteAds,
    isPending: deleteAdsIsPending,
    isSuccess: deleteAdsIsSuccess,
  } = useDeleteAds(adsId);

  useEffect(() => {
    if (deleteAdsIsSuccess) {
      toggle(false);
    }
  }, [deleteAdsIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteAds();
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف إعلان"}>
      {currentAdsIsLoading ? (
        <Spinner />
      ) : !currentAdsIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف الإعلان؟
            <br />
            <span className="text-red-500">{currentAds?.data?.ads?.title}</span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteAdsIsPending}
          >
            {deleteAdsIsPending ? <Spinner sm /> : "حذف"}
          </button>
        </form>
      ) : (
        <div className="w-full text-7xl text-yellow-500 flex justify-center">
          <TiWarning />
        </div>
      )}
    </ActionModal>
  );
}
