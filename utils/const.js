export const API_URL = 'wss://carriertech.uk:8008/'; // Replace with your actual URL

export const emotionColours = {'neutral':{"colour": "#808080", "val":{"speechEmotion":1, "textEmotion":1}}, 
'calm': {"colour": "#75945b", "colourRGB":[117,148,91], "val":{"speechEmotion":1, "textEmotion":1}}, 
'happy': {"colour": "#fff761", "colourRGB":[255,247,97],"val":{"speechEmotion":1, "textEmotion":1}}, 
'sad' : {"colour": "#6e79ff", "colourRGB":[110,121,255],"val":{"speechEmotion":1, "textEmotion":1}}, 
'angry' : {"colour": "#ff4313","colourRGB":[255,67,19], "val":{"speechEmotion":1, "textEmotion":1}}, 
'fear' : {"colour": "#ff8c2d","colourRGB":[255,140,45], "val":{"speechEmotion":1, "textEmotion":1}}, 
'disgust' : {"colour": "#e564df","colourRGB":[229,100,223], "val":{"speechEmotion":1, "textEmotion":1}}, 
'surprise' : {"colour": "#24c9ff","colourRGB":[36,201,255], "val":{"speechEmotion":1, "textEmotion":1}}, 
'love' : {"colour": "#f3cec9","colourRGB":[243,206,201], "val":{"speechEmotion":1, "textEmotion":1}}};


let loggedIn = false;

export const getLoggedIn = () => loggedIn;
export const setLoggedIn = (newState) => {
  loggedIn = newState;
};