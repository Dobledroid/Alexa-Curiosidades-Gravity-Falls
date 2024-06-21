/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {  
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to Gravity Falls Trivia! You can ask for a fun fact or ask for help. What would you like to do?',
            HELLO_MESSAGE: 'Hello and welcome to Gravity Falls Trivia!',
            HELP_MESSAGE: 'You can ask me for a fun fact about Gravity Falls. How can I help you?',
            GOODBYE_MESSAGE: 'Goodbye and thanks for exploring Gravity Falls with me!',
            REFLECTOR_MESSAGE: 'You just triggered %s in Gravity Falls Trivia.',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try asking for a Gravity Falls fun fact.',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
            RANDOM_FACT: 'Here\'s a fun fact about Gravity Falls: %s',
            ANOTHER_FACT_PROMPT: 'Would you like to hear another fun fact about Gravity Falls?'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: '¡Bienvenido a Curiosidades de Gravity Falls! Puedes pedir un dato curioso o pedir ayuda. ¿Qué te gustaría hacer?',
            HELLO_MESSAGE: '¡Hola y bienvenido a Curiosidades de Gravity Falls!',
            HELP_MESSAGE: 'Puedes pedirme un dato curioso sobre Gravity Falls. ¿Cómo te puedo ayudar?',
            GOODBYE_MESSAGE: '¡Adiós y gracias por explorar Gravity Falls conmigo!',
            REFLECTOR_MESSAGE: 'Acabas de activar %s en Curiosidades de Gravity Falls.',
            FALLBACK_MESSAGE: 'Lo siento, no sé nada sobre eso. Por favor, intenta pedir un dato curioso sobre Gravity Falls.',
            ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor, inténtalo otra vez.',
            RANDOM_FACT: 'Aquí tienes un dato curioso sobre Gravity Falls: %s',
            ANOTHER_FACT_PROMPT: '¿Te gustaría escuchar otro dato curioso sobre Gravity Falls?'
        }
    }
};

const data = {
    en: [
        "Gravity Falls is home to the Mystery Shack, a tourist trap full of strange and paranormal artifacts.",
        "Dipper and Mabel Pines are the main characters of Gravity Falls, spending their summer with their great uncle Stan.",
        "Bill Cipher is a dream demon and the main antagonist in Gravity Falls.",
        "Gravity Falls features a hidden code in every episode for fans to decode.",
        "The show's creator, Alex Hirsch, voices several characters, including Grunkle Stan and Soos.",
        "The series ran for two seasons from 2012 to 2016, gaining a cult following.",
        "Gravity Falls is inspired by real-life quirks of the creator’s own childhood.",
        "Waddles, Mabel’s pet pig, was won at a fair and quickly became a fan favorite."
    ],
    es: [
        "Gravity Falls es el hogar de la Cabaña del Misterio, una trampa para turistas llena de artefactos extraños y paranormales.",
        "Dipper y Mabel Pines son los personajes principales de Gravity Falls, pasando su verano con su tío abuelo Stan.",
        "Bill Cipher es un demonio de los sueños y el principal antagonista en Gravity Falls.",
        "Gravity Falls presenta un código oculto en cada episodio para que los fans lo descifren.",
        "El creador del programa, Alex Hirsch, da voz a varios personajes, incluidos Grunkle Stan y Soos.",
        "La serie tuvo dos temporadas desde 2012 hasta 2016, ganando un culto de seguidores.",
        "Gravity Falls está inspirado en las excentricidades reales de la infancia del creador.",
        "Waddles, el cerdo mascota de Mabel, fue ganado en una feria y rápidamente se convirtió en un favorito de los fans."
    ]
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CuriosidadIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CuriosidadIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const language = locale.split('-')[0]; // Extract language code (e.g., "en" from "en-US")
        const frasesArray = data[language];
        const randomIndex = Math.floor(Math.random() * frasesArray.length);
        const randomFrase = frasesArray[randomIndex];
        const speakOutput = handlerInput.attributesManager.getRequestAttributes().t('RANDOM_FACT', randomFrase);
        const repromptOutput = handlerInput.attributesManager.getRequestAttributes().t('ANOTHER_FACT_PROMPT');

        return handlerInput.responseBuilder
            .speak(`${speakOutput} ${repromptOutput}`)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELLO_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NavigateHomeIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CuriosidadIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();