const speakPaths = [
    "/videos/talking1.mp4",
    "/videos/talking2.mp4",
    "/videos/talking3.mp4",
];

const thankfulPaths = [
    "/videos/thankful.mp4",
    "/videos/talking1.mp4",
]

export function videoSelector(statement: string):string[]{
    
    console.log("statement", statement);
    if(statement.toLowerCase().includes("thank")){
        return thankfulPaths;
    }
    return shuffleDefaultTalk();
}

function shuffleDefaultTalk():string[] {
    for(let i = speakPaths.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [speakPaths[i], speakPaths[j]] = [speakPaths[j], speakPaths[i]];
    }
    const duplicatedPaths = speakPaths.flatMap(path => [path, path,path]);
    return duplicatedPaths;
}


