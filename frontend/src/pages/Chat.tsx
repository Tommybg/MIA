"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import { getConnectionDetails, type ConnectionDetails } from "@/api/connection-details/route";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CloseIcon } from "@/components/CloseIcon";
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";

// Diccionario de frases motivacionales
const motivationalQuotes = [
  "Cada día es una nueva oportunidad para crecer y mejorar 🌱",
  "Tu bienestar mental es tan importante como tu salud física 💚",
  "Los pequeños pasos diarios llevan a grandes cambios ✨",
  "Respira profundo, tú tienes el poder de superar cualquier desafío 🌟",
  "Cada momento difícil es una oportunidad de aprendizaje 📚",
  "Tu mente es tu jardín, cultívala con pensamientos positivos 🌸",
  "La autocompasión es el primer paso hacia la sanación 🤗",
  "No estás solo en este viaje, siempre hay apoyo disponible 🤝",
  "Cada día que eliges cuidarte es un día de victoria 🏆",
  "La resiliencia se construye paso a paso, día a día 💪",
  "Tu historia de superación puede inspirar a otros 🌈",
  "El autocuidado no es egoísmo, es supervivencia 🛡️",
  "Cada emoción que sientes es válida y merece ser escuchada 🎭",
  "La terapia es un acto de valentía, no de debilidad 🦋",
  "Tu bienestar emocional es la base de todo lo demás 🏗️",
  "Los días difíciles no duran para siempre, pero las personas fuertes sí 🌅",
  "Invertir en tu salud mental es la mejor inversión que puedes hacer 💎",
  "Cada conversación sobre salud mental ayuda a romper estigmas 💬",
  "Tu progreso puede no ser lineal, pero cada paso cuenta 📈",
  "Recuerda: pedir ayuda es una señal de sabiduría, no de debilidad 🧠"
];

export const Chat = () => {
  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotar frases motivacionales cada 20 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        (prevIndex + 1) % motivationalQuotes.length
      );
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const onConnectButtonClicked = useCallback(async () => {
    try {
      // Generate room connection details for MIA voice assistant
      const connectionDetailsData = await getConnectionDetails();
      updateConnectionDetails(connectionDetailsData);
    } catch (error) {
      console.error("Failed to get connection details:", error);
      alert("Error al conectar con MIA. Por favor, verifica tu conexión e intenta nuevamente.");
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-[calc(100vh-200px)]">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined);
        }}
        className="grid grid-rows-[2fr_1fr] items-center"
      >
        <SimpleVoiceAssistant onStateChange={setAgentState} />
        <ControlBar
          onConnectButtonClicked={onConnectButtonClicked}
          agentState={agentState}
        />
        <RoomAudioRenderer />
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>

      {/* Motivational Quote */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
        <p className="text-sm font-medium text-foreground text-center">
          {motivationalQuotes[currentQuoteIndex]}
        </p>
      </div>
    </div>
  );
};
/*
const StaticVisualizer = () => {
  return (
    <div className="flex justify-center items-center space-x-2 h-[300px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-16 bg-primary/60 rounded-full"
          style={{
            animationDelay: `${i * 0.1}s`,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      ))}
    </div>
  );
};
*/
function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void;
}) {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);

  // Show static bars when disconnected or connecting
  // const isInactive = state === "disconnected" || state === "connecting";

  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      {/* Always show BarVisualizer now */}
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ 
          minHeight: 24
        }}
      />
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
}) {
  // Add Krisp functionality
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, []);

  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {props.agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 1, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 btn-calm rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Habla con MIA 😊
          </motion.button>
        )}
      </AnimatePresence>  
      <AnimatePresence>
        {props.agentState !== "disconnected" &&
          props.agentState !== "connecting" && (
            <motion.div
              initial={{ opacity: 0, top: "10px" }}
              animate={{ opacity: 1, top: 0 }}
              exit={{ opacity: 0, top: "-10px" }}
              transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
            >
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <CloseIcon />
              </DisconnectButton>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error al acceder al micrófono. Por favor, asegúrate de otorgar los permisos necesarios en tu navegador y recarga la página."
  );
}