const speakPaths = [
    "/videos/talking1.mp4",
    "/videos/talking2.mp4",
    "/videos/talking3.mp4",
];

const thankfulPaths = [
    "/videos/thankful.mp4",
    "/videos/talking1.mp4",
]

export function videoSelector(statement: string):string[] {
    console.log(statement);
    if(statement.trim() === ""){
        return shuffleDefaultTalk();
    }
    
    if(statement.toLowerCase().includes("thank")){
        return thankfulPaths;
    }

    else if(statement.toLowerCase().includes("nfc") || statement.toLowerCase().includes("nfc3") || statement.toLowerCase().includes("nfc three")){
        return ["/videos/pointingforward.mp4", "/videos/pointingright.mp4", "/videos/talking3.mp4", "/videos/talking3_rev.mp4"];
    }

    else if(statement.toLowerCase().includes("sky cafe") || statement.toLowerCase().includes("skycafe")){
        return ["/videos/pointingforward.mp4", "/videos/talking3.mp4" ,"/videos/talking3_rev.mp4"];
    }

    else if(statement.toLowerCase().includes("lcs") || statement.toLowerCase().includes("lcs1") || statement.toLowerCase().includes("lcs2") || statement.toLowerCase().includes("lcs 1") || statement.toLowerCase().includes("lcs 2")){ 
        return ["/videos/pointingforward.mp4","/videos/pointingleft.mp4", "/videos/talking3.mp4", "/videos/talking3_rev.mp4"];
    }

    else if(statement.toLowerCase().includes("iot") || statement.toLowerCase().includes("i o t")){ 
        return ["/videos/pointingforward.mp4","/videos/pointingleft.mp4", "/videos/talking3.mp4", "/videos/talking3_rev.mp4"];
    }

    else if(statement.toLowerCase().includes("ris") || statement.toLowerCase().includes("r i s")){ 
        return ["/videos/pointingforward.mp4","/videos/pointingleft.mp4", "/videos/pointingleft.mp4", "/videos/talking3.mp4", "/videos/talking3_rev.mp4"];
    }
    else if (statement.toLowerCase().includes("bye") || statement.toLowerCase().includes("goodbye") || statement.toLowerCase().includes("see you later")){
        return ["/videos/waving.mp4"];
    }
    else if (statement.toLowerCase().includes("assignment") || statement.toLowerCase().includes("project") || statement.toLowerCase().includes("homework")){
        return ["/videos/tellingASecret.mp4"];
    }

    return shuffleDefaultTalk();
}

function shuffleDefaultTalk():string[] {
    for(let i = speakPaths.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [speakPaths[i], speakPaths[j]] = [speakPaths[j], speakPaths[i]];
    }

    const result: string[] = [];
    speakPaths.forEach((video) => {
        result.push(video, video.replace(".mp4", "_rev.mp4"));
    });

    return speakPaths;
}


