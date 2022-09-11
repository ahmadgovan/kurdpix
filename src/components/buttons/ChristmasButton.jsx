/**
 *
 * @flow
 */

import React, { useState } from 'react';
import { GiPineTree } from 'react-icons/gi';

import SnowStorm from '../../ui/snow';

const videoIds = [
  'bMPpZlok6aU',
  'xcrYffFhTlw',
  'lCZ5kIFz-h8',
  'XSpYaEdpKxY',
  'dTX-6WdiXx8',
];

const snowStorm = new SnowStorm(window, document);

const ChristmasButton = () => {
  const [playing, setPlaying] = useState(false);
  const prot = window.location.protocol;

  const video = videoIds[Math.floor(Math.random() * videoIds.length)];
  const url = `${prot}//www.youtube.com/embed/${video}?autoplay=1&loop=1`;

  return (
    <div
      id="minecrafttpbutton"
      className="actionbuttons"
      role="button"
      tabIndex={-1}
      onClick={() => {
        setPlaying(!playing);
        snowStorm.toggleSnow();
      }}
      style={{
        boxShadow: (playing)
          ? '0 0 9px 6px rgba(0, 189, 47, 0.8)'
          : '0 0 9px 6px rgba(189, 0, 0, 0.8)',
      }}
    >
      <GiPineTree />
      {(playing) && (
        <embed
          style={{
            height: 120,
            width: 214,
            position: 'fixed',
            right: 16,
            top: 58,
          }}
          src={url}
        />
      )}
    </div>
  );
};

export default ChristmasButton;