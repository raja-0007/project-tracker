
const Avatar = ({text}:{text:string}) => {
    return (
        <div className='rounded-full w-8 h-8 flex justify-center items-center font-medium text-sm bg-gray-700 text-white'>
            {text}
        </div>
    )
}

export default Avatar