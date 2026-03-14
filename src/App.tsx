import React, { useRef, useState } from "react";

const App: React.FC = () => {
  const radioPlayerRef = useRef<HTMLAudioElement>(null);
  const musicPlayerRef = useRef<HTMLAudioElement>(null);

  const [volume, setVolume] = useState(50);
  const [coverSrc, setCoverSrc] = useState<string | null>(null);
  const [songs, setSongs] = useState<Array<{ name: string; src: string }>>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  const handlePlayRadio = () => {
    if (radioPlayerRef.current) {
      radioPlayerRef.current.play();
    }

    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
    }

    setCurrentSong(null);
  };

  const handlePauseRadio = () => {
    if (radioPlayerRef.current) {
      radioPlayerRef.current.pause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(Number(e.target.value));

    if (radioPlayerRef.current) {
      radioPlayerRef.current.volume = newVolume;
    }

    if (musicPlayerRef.current) {
      musicPlayerRef.current.volume = newVolume;
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setCoverSrc(event.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSongsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newSongs = files.map((file) => {
      return new Promise<{ name: string; src: string }>((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          resolve({
            name: file.name,
            src: event.target?.result as string,
          });
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(newSongs).then((loadedSongs) => {
      setSongs((prevSongs) => [...prevSongs, ...loadedSongs]);
    });
  };

  const playSong = (song: { name: string; src: string }) => {
    if (musicPlayerRef.current) {
      musicPlayerRef.current.src = song.src;
      musicPlayerRef.current.play();
      setCurrentSong(song.name);
    }

    if (radioPlayerRef.current) {
      radioPlayerRef.current.pause();
    }
  };

  const handleMusicEnd = () => {
    setCurrentSong(null);

    if (radioPlayerRef.current) {
      radioPlayerRef.current.play();
    }
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#6200ea",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1em",
    cursor: "pointer",
    marginRight: "10px",
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <header
        style={{
          backgroundColor: "#6200ea",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h1>Vision Midia Digital</h1>
        <p>Conectado com você onde quer que vá</p>

        {coverSrc && (
          <img
            src={coverSrc}
            alt="Capa da Rádio"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        )}
      </header>

      <audio
        ref={radioPlayerRef}
        src="https://stream.zeno.fm/p6tefup8v1mvv"
        preload="none"
      />

      <div style={{ margin: "20px 0" }}>
        <button onClick={handlePlayRadio} style={buttonStyle}>
          ▶ Tocar Rádio
        </button>
        <button onClick={handlePauseRadio} style={buttonStyle}>
          ⏸ Pausar Rádio
        </button>
        <br />
        <br />
        Volume
        <br />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
        {/* ANÚNCIO WHATSAPP */}
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold", color: "#6200ea" }}>
            ANÚNCIE AQUI
            <br />
          </p>

          <a
            href="https://wa.me/5562994995768"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "8px",
                fontSize: "1em",
                cursor: "pointer",
              }}
            >
              📲 Falar no WhatsApp
            </button>
          </a>
        </div>
      </div>

      <div>
        <label>Enviar Capa da Rádio</label>
        <br />
        <input type="file" accept="image/*" onChange={handleCoverUpload} />
      </div>

      <br />

      <div>
        <label>Enviar Músicas</label>
        <br />
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={handleSongsUpload}
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Minhas Músicas</h2>

        {currentSong && (
          <p>
            <b>Tocando agora:</b> {currentSong}
          </p>
        )}

        <audio
          ref={musicPlayerRef}
          controls
          onEnded={handleMusicEnd}
          style={{
            width: "100%",
            display: songs.length > 0 ? "block" : "none",
          }}
        />

        <ul style={{ listStyle: "none", padding: 0 }}>
          {songs.map((song, index) => (
            <li key={index} style={{ margin: "10px 0" }}>
              <button style={buttonStyle} onClick={() => playSong(song)}>
                🎵 {song.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
