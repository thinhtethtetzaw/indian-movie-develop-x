import LoaderIcon from "@/assets/svgs/loader.svg?react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoaderIcon className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
