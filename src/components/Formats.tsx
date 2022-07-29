import { useState } from "react";
import { Dataset, Distribution } from "../types";

const Formats = ({
  formats,
  entry,
}: {
  formats: Distribution[];
  entry: Dataset;
}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      {show && (
        <>
          <div className="dialog-overlay" onClick={() => setShow(false)} />
          <dialog open>
            <div className="x-row">
              <h2>
                <a href={entry.entryUri} target="_blank" rel="noopener">
                  {entry.title || "Ingen tittel"}
                </a>
              </h2>
              <div className="x-grow" />
              <button type="button" onClick={() => setShow(false)}>
                Lukk
              </button>
            </div>
            <p>{entry.description}</p>
            {formats.map((v: Distribution, i: number) => {
              return (
                <ul key={i}>
                  {v.format === "API" ? (
                    <li>
                      {!!v.accessURL?.length && (
                        <a
                          href={v.accessURL ? v.accessURL[0] : "#"}
                          target="_blank"
                          rel="noopener"
                        >
                          Spesifikasjon
                        </a>
                      )}{" "}
                      {!!v.downloadURL?.length && (
                        <a
                          href={v.downloadURL ? v.downloadURL[0] : "#"}
                          target="_blank"
                          rel="noopener"
                        >
                          Endepunkt
                        </a>
                      )}
                    </li>
                  ) : (
                    <li>
                      {v.description}{" "}
                      <a
                        href={
                          v.accessURL && v.accessURL.length
                            ? v.accessURL[0]
                            : entry.entryUri
                        }
                        className="format"
                        key={i}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {v.format
                          ? Array.isArray(v.format)
                            ? v.format.join(", ")
                            : v.format
                          : v.description || "Data"}
                      </a>
                    </li>
                  )}
                </ul>
              );
            })}
          </dialog>
        </>
      )}
      <button
        type="button"
        onClick={() => {
          console.log(entry);
          setShow(true);
        }}
      >
        Vis {formats.length} {formats.length > 1 ? "lenker" : "lenke"}
      </button>
    </>
  );
};

export default Formats;
