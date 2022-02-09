/*
 * Renders a markdown link
 * Also provides previews
 * Links are assumed to start with protocol (http:// etc.)
 */
import React, { useState } from 'react';
import { HiArrowsExpand, HiStop } from 'react-icons/hi';

import { getLinkDesc } from '../core/utils';
import EMBEDS from './embeds';

const titleAllowed = [
  'odysee',
  'twitter',
  'matrix.pixelplanet.fun',
  'youtube',
  'youtu.be',
];

const MdLink = ({ href, title }) => {
  const [showEmbed, setShowEmbed] = useState(false);

  const desc = getLinkDesc(href);

  // treat pixelplanet links seperately
  if (desc === window.location.hostname && href.includes('/#')) {
    const coords = href.substring(href.indexOf('/#') + 1);
    return (
      <a href={`./${coords}`}>{title || coords}</a>
    );
  }

  const embedObj = EMBEDS[desc];
  const embedAvailable = embedObj && embedObj[1](href);
  const Embed = embedObj && embedObj[0];


  let parsedTitle;
  if (title && titleAllowed.includes(desc)) {
    parsedTitle = title;
  } else if (embedAvailable && embedObj[2]) {
    parsedTitle = embedObj[2](href);
  } else {
    parsedTitle = href;
  }

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {parsedTitle}
      </a>
      {(embedAvailable) && (
        <>
          &nbsp;
          {(embedObj[3])
            && (
            <img
              style={{
                width: '1em',
                height: '1em',
                verticalAlign: 'middle',
              }}
              src={embedObj[3]}
              alt={`${desc}-icon`}
            />
            )}
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => setShowEmbed(!showEmbed)}
          >
            {(showEmbed)
              ? (
                <HiStop
                  style={{ verticalAlign: 'middle', color: 'red' }}
                />
              )
              : (
                <HiArrowsExpand
                  style={{ verticalAlign: 'middle', color: '#4646ff' }}
                />
              )}
          </span>
        </>
      )}
      {(showEmbed && embedAvailable) && <Embed url={href} />}
    </>
  );
};

export default React.memo(MdLink);