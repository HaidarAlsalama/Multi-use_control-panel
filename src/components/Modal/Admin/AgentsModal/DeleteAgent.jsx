import { useAgentById, useDeleteAgent } from "api/admin/agent";
import { Spinner } from "components";
import { useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import ActionModal from "../../ActionModal/ActionModal";

export default function DeleteAgent({ isOpen, toggle, agentId }) {
  const {
    data: currentAgent,
    isFetching: currentAgentIsLoading,
    isError: currentAgentIsError,
  } = useAgentById(agentId);

  const {
    mutate: deleteAgent,
    isPending: deleteAgentIsPending,
    isSuccess: deleteAgentIsSuccess,
  } = useDeleteAgent(agentId);

  useEffect(() => {
    if (deleteAgentIsSuccess) {
      toggle(false);
    }
  }, [deleteAgentIsSuccess, toggle]);

  const onSubmit = (e) => {
    e.preventDefault();
    deleteAgent();
  };

  return (
    <ActionModal open={isOpen} close={toggle} size="xSmall" title={"حذف وكيل"}>
      {currentAgentIsLoading ? (
        <Spinner />
      ) : !currentAgentIsError ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <h1 className="mx-auto text-2xl text-gray-800 dark:text-white">
            هل أنت متأكد من حذف الوكيل؟
            <br />
            <span className="text-red-500">
              {currentAgent?.data?.agent.name}
            </span>
          </h1>
          <button
            type="submit"
            className="btn btn-primary mx-auto !py-1 w-20"
            disabled={deleteAgentIsPending}
          >
            {deleteAgentIsPending ? <Spinner sm /> : "حذف"}
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
