import { useEscapeKey } from "@/hooks/UseEscapeKey";
import { BaseModalProps } from "@/types/ui";

export function BaseModal({ onClose, children, maxWidth = "750px", maxHeight = "750px", title = "", titleColor = 'white' }: BaseModalProps) {
  // Fecha com ESC
  useEscapeKey(onClose);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="relative overflow-y-auto p-5 rounded-md shadow-lg bg-bgtextdark border-[7px] border-primary outline-[3px] outline outline-bgdarkblue "
        style={{ maxWidth, maxHeight, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b-[7px] border-primary outline-b-[3px] outline-b outline-bgdarkblue rounded-md mb-8">
          <h2 className={`mt-0 mb-8 flex justify-center ${titleColor} text-3xl text-shadow-title`}>{title}</h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 font-bold text-bgdarkblue text-xl hover:text-red-400 py-2 px-4 bg-primary rounded-lg "
            aria-label="Fechar modal"
          > ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}