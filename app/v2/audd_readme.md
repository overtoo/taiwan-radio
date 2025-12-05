api key can be found in the .env.local file as AUDD_API_KEY

AudD Music Recognition API Docs
Quick Start
Our API is praised for how easy it is to integrate. Get started in seconds: Sign up for an API token.

Overview
AudD is a powerful music recognition API that identifies songs from audio files, live streams, and large video files with industry-leading accuracy and enterprise-grade features.

📋 Quick Example
curl https://api.audd.io/ \
 -F url='https://audd.tech/example.mp3' \
 -F api_token='test'

🚀 API Endpoints
Endpoint Best For File Size Response Time
Standard Recognition Single song identification Up to 12 seconds ~0.1-1.5 seconds
Audio Streams Real-time monitoring Continuous streams Real-time
Enterprise Large files Unlimited Seconds to minutes
For the live music recognition for audio streams, see docs for audio streams: useful if you want to identify music playing on radio stations, audio and video streams, etc.; e.g., if you want to monitor airplay, check live streams for copyright, create radio charts, now playing widgets, or bots for YouTube and Twitch streams.

We have a separate API endpoint that accepts large audio and video files (even hours-long mixes or days-long recordings) and recognizes all the tracks in them: see docs for the enterprise endpoint. Especially useful for some types of UGC and other content that you might want to check against our copyrighted music DB.

Some API methods are not public. Please coordinate access with your AudD contact.

You can send requests via GET and POST, with parameters in the query or the request body.

api_token — the auth token. It's required for all API requests. Sign up on the Dashboard to get one.
post
/
get
Standard Recognition
https://api.audd.io/

This is the default API method. It allows identifying music in audio, just like Shazam. A file is required: tap on the Code examples tab below or Sending files section.

Request
Response
Code examples
Form Data Parameters
api_token
REQUIRED
stringThe token received from the Dashboard
url
POSSIBLY REQUIRED
stringThe URL of the file for the recognition
file
POSSIBLY REQUIRED
binaryThe file for the recognition
return
OPTIONAL
stringComma-separated identifiers of the additional metadata, see below
market
OPTIONAL
stringCountry code for Apple Music, iTunes, and Spotify results, default: us
info
The return parameter is for comma-separated identifiers of the additional metadata you want to be returned. The identifiers you can send: musicbrainz – MusicBrainz metadata; apple_music, spotify, deezer, napster – Apple Music, Spotify, Deezer, Napster data and links respectively. Example: apple_music,spotify.

Tip: GET requests
You can also send GET requests, even though it's better to send the parameters in the POST body. Here's an example:
https://api.audd.io/?url=https://audd.tech/example1.mp3&return=apple_music,spotify&api_token=your%20api%20token
Just don't forget to url-encode the parameters.

Sending files
For the default API method, you have to send a file for recognition. There are three ways to send files to our API:

Provide an HTTP URL for the file to be recognized. Our server will download the file and identify the music. Send the URL in the url parameter as a string. The parameter can be sent either in the request body or query parameters, by GET or POST. We highly recommend sending files this way. If the file is available by URL, it's the easiest way to send it.
Post the file using multipart/form-data in the usual way browsers upload files. Send the file in the file parameter, by POST. We recommend sending a file this way when the file is not available by a URL (for example, if they are recorded locally or are not on a server).
Send a base64 encoded file in the audio parameter, as a string, by POST. We discourage the use of this parameter and have very limited support for it.
There are code examples for the first two ways in the Code examples tab of the API method description. Our custom GPT can help you write code.

The API also supports async WebSockets: connect to wss://api.audd.io/ws/?api_token=[token] and send multiple requests (with files in binary form) without waiting for the server's responses/results.

Responses explained
By default, the API responses are in JSON format.

All the responses contain the status field that equals either "success" if the request was successfully processed or "error" if there's been an error. In case of success, the server always returns the result field.

If the server has successfully processed the request, but there are no matches, the result field could be null or an empty array, depending on the API method.

If there are matches, the default API method will return a result that's a structure that always contains artist, title, album, release_date, label, timecode, and song_link fields. Additionally, it has the data requested in the return parameter in fields corresponding to the identifiers. And just in case: timecode is the time in the recognized song when the fragment you sent is played; song_link links to a lis.tn song page like lis.tn/Warriors. Please let us know if you need album pages instead of song pages.

Authentication and limits
To send requests, get a token from the Dashboard. Normally, our plans include as-you-go pricing: some number of requests is included with your monthly bill, but you can send requests on top of what's included and will be charged for those separately. If you want custom terms, we can discuss that if you want to send >500 000 requests per month or identify music from over 100 streams. Reach out: api@audd.io, +1(302)283-9101.

Where to find code examples
There are Code examples tabs in each of the request descriptions. You can use them for reference.
You can search for code examples on GitHub.
We have a Chrome extension written in JS that recognizes music from the open tab of your browser. Source code: github.com/AudDMusic/audd-chrome-extension.
We have a Discord bot written in Go that identifies music from files sent to text channels and music broadcasted on voice channels: github.com/AudDMusic/discord-bot.
Common errors
We have about 40 different error codes. The API returns the errors with an explanation of what happened. The common errors:

#901 — No api_token passed, and the limit was reached (you need to obtain an api_token).
#900 — Invalid API token (check the api_token parameter).
#600 — Incorrect audio url.
#700 — You haven't sent a file for recognition (or we didn't receive it). If you use the POST HTTP method, check the Content-Type header: it should be multipart/form-data; also check the URL you're sending requests to: it should start with https:// (http:// requests get redirected and we don't receive any data from you when your code follows the redirect).
#500 — Invalid audio file.
#400 — Too big audio file. 10M or 25 seconds is the maximum. We recommend recording no more than 20 seconds (usually, it takes less than one megabyte). If you need to recognize music from larger audio files, use the enterprise endpoint instead, it supports even days-long files.
#300 — Fingerprinting error: an instance running network inference ran into an error. Often, it means that the audio file is too small.
If something unexpected happens, reach out!
