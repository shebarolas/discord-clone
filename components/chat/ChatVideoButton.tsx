"use client"
import ActionTooltip from '../ActionTooltip'
import qs from 'query-string';
import { Video, VideoOff } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ChatVideoButton() {

    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get('video');
    const icon = isVideo ? <Video/> : <VideoOff/>;
    const toltipLabel = isVideo ? 'Terminar llamada' : 'Empezar llamada';

    const onClick = ()=> {
        const url = qs.stringifyUrl({
            url: pathName || '',
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true })

        router.push(url);
    }


  return (
    <ActionTooltip side='bottom' label={toltipLabel}>
        <button onClick={onClick} className='hover:opacity-75 transition mr-4'>
            <div className="h-6 w-6 text-zinc-500 dark:text-zinc-400">
                {icon}
            </div>
        </button>

    </ActionTooltip>
  )
}
