import { SpeechConfig, AudioConfig, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
    initMicrosoft() {
      const speechConfig = SpeechConfig.fromSubscription("082d253794da4d4aa4dc51fe21b85c43", "eastasia");
      const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
      // speechConfig.SpeechRecognitionLanguage = "zh-CN";
      // speechConfig.SpeechSynthesisLanguage = "zh-CN";
      this.speechConfig = speechConfig;
      this.audioConfig = audioConfig;
    },
    getText(text) {
      return this.praseXML(`<?xml version="1.0" encoding="UTF-8"?><speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="zh-CN"><voice name="zh-CN-XiaoyouNeural">${ text }</voice></speak>`);
    },
    praseXML(data) {
        var xml, tmp;
        try {
            if ( window.DOMParser ) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { // IE
                // eslint-disable-next-line no-undef
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        return (new XMLSerializer()).serializeToString(xml);
    },
    playAudio() {
      const { speechConfig, audioConfig } = this;
      // 禁用字边界
      // eslint-disable-next-line no-debugger
      var synthesizer = new SpeechRecognizer(speechConfig, audioConfig);
      synthesizer.recognizeOnceAsync(
        result => {
          console.log(result);
        });
    },
