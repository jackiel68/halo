import React from 'react';

export const transformText = (text, fontClassName, listClassName, bulletClassName) => {
  if (!text) { return }

  const textSections = text.split('\\n');

  // separates out bullet points by looking for wrapped text that has 6 asterisks on each side
  return (
    <div>
      {textSections.map((section, i) => {
        if (section.includes('****')) {
          // SECTION HAS BULLET POINTS
          return (
            <ul key={`section-${i}`} className={listClassName}>
              {section.split("****").map((bulletPoint, j) => {
                if (bulletPoint && bulletPoint.length > 0) {
                  return (
                    <li key={`item-${i}-${j}`} className={bulletClassName}>{bulletPoint}</li>
                  );
                } else {
                  return <></>;
                }
              })}
            </ul>
          );
        } else {
          // SECTION WITHOUT BULLET POINTS
          return (
            <div key={`section-${i}`} className={fontClassName}>{section}</div>
          );
        }
      })}
    </div>
  );
}
