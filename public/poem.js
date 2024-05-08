
lastGenerate = NaN
TIMELIMIT = 10 // seconds
function generate(){
    word = document.getElementById("word_input").value;
    wordCheck = /^[A-Za-z]{2,20}$/
    if (lastGenerate!=NaN && new Date()-lastGenerate<TIMELIMIT*1000){
        alert(`Wait another ${parseInt(TIMELIMIT-(new Date()-lastGenerate)/1000)} seconds before the next generate.`)
        return
    }
    lastGenerate = new Date()

    if (wordCheck.test(word)){
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                res = JSON.parse(xhr.responseText);
                console.log(res);
                if (res.poem=="Error"){
                    start=false;
                    setProgressBar(0);
                    alert("This word doesn't fit.");
                }else{
                    start = false;
                    setProgressBar(100);
                    setTimeout(()=>(location.reload()), 700);
                }
            }else{
                start=false;
                setProgressBar(0);
                if (xhr.responseText){
                    res = JSON.parse(xhr.responseText);
                    console.log(res)
                    alert(`Not successful, problem: ${res.problem}`)
                }else{
                    alert("Try to reload the page.")
                }
            }
        };
        const json = { "type": "generate", "word": word};
        xhr.open('POST', '/data');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        start = true;
        startProgress(0);
    }else{
        alert("This word doesn't fit.")
    }

}

function setProgressBar(n){
    bar = document.getElementById("progress-bar")
    bar.style.width = `${n}%`;
}
function getProgressBar(){
    bar = document.getElementById("progress-bar");
    return parseInt(bar.style.width.slice(0, -1));
}


start = false
function startProgress(n) {
    setTimeout(()=>{
        if (!start){return}

        if (n+4 < 50){
            setProgressBar(n+4)
            startProgress(n+4)
        }else if (n+3 < 80){
            setProgressBar(n+3)
            startProgress(n+3)
        }else if (n+2 < 100) {
            setProgressBar(n+1)
            startProgress(n+1)
        }else{
            return
        }
    }, 200)
}
