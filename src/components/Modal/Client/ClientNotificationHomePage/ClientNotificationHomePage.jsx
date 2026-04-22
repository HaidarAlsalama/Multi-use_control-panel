import { useEffect, useState } from "react";
import ClientActionModal from "../ClientActionModal/ClientActionModal";
import { useClientAds } from "api/Client/ads";

export default function ClientNotificationHomePage() {
  const {
    data: ads,
    isFetching: adsIsFetching,
    isSuccess: adsIsSuccess,
    isError: adsIsError,
  } = useClientAds();

  if (adsIsError) return null;

  if (adsIsSuccess && ads.data.length > 0)
    return (
      <>
        {ads.data.map((ad) => (
          <Modal title={ad.title} open={true} description={ad.description} />
        ))}
      </>
    );
  return null;
}

const Modal = ({ open, title, description }) => {
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(open);
  if (!isModalNotificationOpen) return null;

  return (
    <ClientActionModal
      open={isModalNotificationOpen}
      close={setIsModalNotificationOpen}
      title={title}
      size="small"
    >
      <div className="text-white">
        <HtmlRenderer htmlContent={description} />
      </div>
    </ClientActionModal>
  );
};

const HtmlRenderer = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
