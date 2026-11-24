import { useEffect, useState } from 'react';

function TextToSpeech({ Text }) {

    const [IsReading, SetIsReading] = useState(false);

    const HandleRead = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported');
            return;
        }

        window.speechSynthesis.cancel();

        const Speech = new SpeechSynthesisUtterance(Text);

        Speech.lang = 'en-US';
        Speech.rate = 1;
        Speech.pitch = 1;

        Speech.onend = () => {
            SetIsReading(false);
        };

        Speech.onerror = () => {
            SetIsReading(false);
        };

        SetIsReading(true);

        window.speechSynthesis.speak(Speech);
    };

    const HandleStop = () => {
        window.speechSynthesis.cancel();
        SetIsReading(false);
    };

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className="speech-controls">

            <button
                onClick={HandleRead}
                disabled={IsReading || !Text}
            >
                Read Aloud
            </button>

            <button
                onClick={HandleStop}
                disabled={!IsReading}
            >
                Stop Reading
            </button>

        </div>
    );
}

export default TextToSpeech;