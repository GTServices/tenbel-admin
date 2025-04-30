function LangTitle({title, error = false}){
    return <span style={{color:error ? 'red' : ''}}>{title}</span>
}

export default LangTitle;