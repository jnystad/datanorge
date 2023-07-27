import { useState } from "react";
import { Dataset, Distribution } from "../types";
import "./Formats.scss";

function Formats({
  formats,
  entry,
}: {
  formats: Distribution[];
  entry: Dataset;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      {show && (
        <>
          <dialog className="formats" open onClick={() => setShow(false)}>
            <article onClick={(e) => e.stopPropagation()}>
              <header>
                <a
                  href="#close"
                  className="close"
                  title="Lukk"
                  onClick={(e) => {
                    e.preventDefault();
                    setShow(false);
                  }}
                />
                {entry.title || "Ingen tittel"} &nbsp;&ndash;&nbsp;{" "}
                <a href={entry.entryUri} target="_blank" rel="noopener">
                  Vis i data.norge.no
                </a>
              </header>
              <p className="description">{entry.description}</p>
              {!entry.keyword || !entry.keyword.length ? null : (
                <p>
                  {entry.keyword.map((v: string, i: number) => (
                    <span className="tag" key={i}>
                      {v}
                    </span>
                  ))}
                </p>
              )}
              <p>
                <table>
                  {formats.map((v: Distribution, i: number) =>
                    v.format === "API" ? (
                      <tr key={i}>
                        <td>
                          {!!v.downloadURL?.length &&
                            (v.downloadURL ? (
                              <>
                                {v.downloadURL[0]}
                                <br />
                              </>
                            ) : (
                              ""
                            ))}
                        </td>
                        <td>
                          {!!v.accessURL?.length && v.accessURL[0] && (
                            <a
                              href={v.accessURL[0]}
                              target="_blank"
                              rel="noopener"
                            >
                              Spesifikasjon
                            </a>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td>
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
                        </td>
                        <td>{v.description}</td>
                      </tr>
                    )
                  )}
                </table>
              </p>
            </article>
          </dialog>
        </>
      )}
      <button
        type="button"
        onClick={() => {
          setShow(true);
        }}
      >
        Vis detaljer og {formats.length}{" "}
        {formats.length > 1 ? "lenker" : "lenke"}
      </button>
    </>
  );
}

export default Formats;
