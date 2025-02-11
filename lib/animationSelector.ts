import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
});

export async function getVideoFilePathsFromAI(userInput: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": `
                        Role: You are an Animation Selector for video streaming platform.

Instructions:
1.  Consider about statement provided by the user.
2. Using the provided VIDEO_PATHS, select suitable video paths matching with the user statement.
3. The selected video paths either one or many.
4. You should carefully order the video paths matching with the phrases of the statement.
 

VIDEO_PATHS
--------------------------
1. For general talking: "/video/taking2.mp4" or "/video/taking3.mp4"
2. For left direction: "/video/pointingleft.mp4"
3. For right direction: "/video/pointingright.mp4"
4. For any other direction: "/video/forward.mp4"
5. For question asking: "/video/question.mp4"
6. For explaining something: "/video/talking1.mp4"
7. For explaining something: "/video/talking3.mp4"
8. For good bye: "/video/waving.mp4"
9. For idle: "/video/standingidle.mp4"
10.For saying statements like you are welcome : "/video/thankful.mp4"
11. For telling a secret: "/video/tellingASecret.mp4"

Examples:

Statement: Hello Good Morning. How can I help you today?
Selected Video Paths: "/video/taking3.mp4"
-----

Statement: Dr. Ravimal Bandara is a Senior Lecturer in Computer Science. He holds a B.Sc. (Hons) in Computer Science from USJ, Sri Lanka, and a Ph.D. from the University of Moratuwa, Sri Lanka. His fields of interest include machine vision, signal processing, and multimedia technologies. You can reach him via email at ravimal@sjp.ac.lk.

Selected Video Paths: "/video/taking3.mp4",  "/video/taking2.mp4", "/video/taking1.mp4"
-----
Statement: The Human Computer Interaction lecture for ICT students is on Tuesday from 10:15 AM to 12 PM. The lecture can be held at the Robotics and Intelligence Systems Lab or NFC3.
Selected Video Paths: "/video/taking2.mp4", "/video/taking3.mp4"
-----
Statement: To get to the Sky Café, take the elevator up to the fourth floor. Once you exit the elevator, you will see the Sky Café right in front of you.
Selected Video Paths: "/video/pointingright.mp4","/video/pointingforward.mp4"
-----
Statement: To reach the IoT lab, take the elevator up to the second floor, go straight ahead passing the NFC 3 lecture hall until you reach the washrooms. Then turn left, and you'll find the IoT lab right next to the entrance of LCS 1.
Selected Video Paths: "/video/pointingforward.mp4","/video/pointingleft.mp4"
-----


End Goal :  Your goal is to analyze the user input and return array video file path that matching to the user input based on the given instructions. 

                        `
                    },
                    {
                        "type": "text",
                        "text": "User Input: " + userInput
                    }

                ]
            },
        ],
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "video_file_paths",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "video_files": {
                            "type": "array",
                            "description": "A collection of paths to video files.",
                            "items": {
                                "type": "string",
                                "description": "A path to a video file."
                            }
                        }
                    },
                    "required": [
                        "video_files"
                    ],
                    "additionalProperties": false
                }
            }
        },
        temperature: 0.25,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });
    return response
}