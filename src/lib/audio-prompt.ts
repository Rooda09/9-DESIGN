import type { AudioInput, DomainKey } from './types';

export function buildAudioPrompt(audio: AudioInput, domain: DomainKey): string {
  const domainBase = {
    ARCHITECTURE: 'cinematic architectural background score with spatial ambience, refined atmosphere, no distracting melody',
    PHOTOGRAPHY: 'commercial product campaign music with clean rhythm, premium pacing, subtle sound design',
    BRANDING: 'brand-film audio bed with memorable mood, polished identity, emotional but controlled tone'
  } satisfies Record<DomainKey, string>;

  return [
    domainBase[domain],
    audio.mood ? `mood: ${audio.mood}` : '',
    audio.genre ? `genre: ${audio.genre}` : '',
    audio.tempo ? `tempo: ${audio.tempo}` : '',
    audio.ambience ? `ambience: ${audio.ambience}` : '',
    audio.sfxDirection ? `SFX: ${audio.sfxDirection}` : '',
    audio.voiceoverUse ? `voiceover: ${audio.voiceoverUse}` : ''
  ].filter(Boolean).join(', ');
}
