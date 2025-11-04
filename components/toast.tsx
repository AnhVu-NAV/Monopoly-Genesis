interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm bg-primary text-primary-foreground rounded-lg px-6 py-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 z-40">
      <p className="font-semibold">{message}</p>
    </div>
  )
}
