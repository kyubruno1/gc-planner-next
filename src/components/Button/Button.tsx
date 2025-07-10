interface ButtonProps {

}
export function Button({ children }: ButtonProps) {
  return (
    <button className="p-5 bg-linear-to-t from-bghovermodal to-bgtextdark rounded-md text-gold font-bold text-md text-shadow-title shadow-lg cursor-pointer">
      {children}
    </button>
  )
}
