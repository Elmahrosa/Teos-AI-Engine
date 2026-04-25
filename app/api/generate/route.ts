function rand(min:number,max:number){
 return Math.floor(Math.random()*(max-min+1))+min;
}

function pick(arr:string[]){
 return arr[Math.floor(Math.random()*arr.length)];
}

function getBestTime(platform:string){
 const map:any={
  X:["8-10 AM","12-1 PM","6-8 PM"],
  LinkedIn:["7-9 AM","11-1 PM","5-6 PM"],
  Facebook:["1-3 PM","6-8 PM"],
  Instagram:["11 AM-1 PM","7-9 PM"],
  TikTok:["12 PM","6 PM","9 PM"],
  Threads:["9 AM","2 PM","8 PM"],
  Telegram:["10 AM","8 PM"],
  WhatsApp:["9 AM","7 PM"]
 };
 return pick(map[platform]||["9 AM"]);
}

function dynamicHashtags(topic:string,platform:string){
 const core=["#AI","#SaaS","#Startups","#BuildInPublic","#ContentMarketing"];
 const egypt=["#Egypt","#PiNetwork","#Founders"];
 return [...core.sort(()=>0.5-Math.random()).slice(0,3),
 ...egypt.sort(()=>0.5-Math.random()).slice(0,2)];
}

function dynamicCTA(){
 return pick([
 "Comment your take below.",
 "Try this strategy today.",
 "Save this post for later.",
 "Would you test this?",
 "DM me if you agree.",
 "Share with another founder."
 ]);
}

function dynamicHook(topic:string){
 return pick([
`Hot take: ${topic}`,
`Nobody talks enough about ${topic}`,
`3 lessons about ${topic}`,
`Unpopular opinion on ${topic}`,
`What founders miss about ${topic}`
]);
}

function fallbackPost(topic:string,platform:string){
 const score=rand(74,97);

 return{
  post:`
🚀 ${dynamicHook(topic)}

${pick([
"Attention is cheap. Distribution wins.",
"Execution beats ideas every time.",
"Founders who publish consistently grow faster."
])}

${topic} matters more than most people realize on ${platform}.
`,
hashtags:dynamicHashtags(topic,platform),

insights:{
 visibilityScore:score,
 bestTime:getBestTime(platform),
 suggestedCTA:dynamicCTA(),
 checklist:[
 "Strong hook",
 "Clear value",
 "Platform optimized",
 "Trend hashtags included"
 ]
},
imagePrompt:
`Cinematic social media visual about ${topic} for ${platform}`,
videoScript:
`Hook:${topic}
Scene1 problem
Scene2 insight
Scene3 CTA`
 };
}