interface Props {
    message?: string; // Optional prop
}

export default function InputError({ message }: Props) {
    if (!message) return null; // Don't render anything if message is undefined

    return <span className="text-red-500 text-xs">{message}</span>;
}