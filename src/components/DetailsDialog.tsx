import { useMemo } from "react";
import { parse } from "marked";
import sanitize from "sanitize-html";
import { Dataset, Distribution } from "../types/Dataset";
import { IconBuilding, IconExternalLink } from "@tabler/icons-react";
import "./DetailsDialog.scss";

function toHtml(markdown: string) {
  const content = parse(markdown || "", {
    headerIds: false,
    mangle: false,
  });
  const sanitized = sanitize(content);
  return sanitized.replace(/<a href=/g, '<a target="_blank" rel="noreferrer noopener" href=');
}
export function DetailsDialog({ entry, onClose }: { entry: Dataset; onClose: () => void }) {
  const description = useMemo(() => {
    console.log(entry.description);
    return toHtml(entry.description);
  }, [entry.description]);

  const formats = entry.distribution;

  return (
    <dialog className="details-dialog" open onClick={onClose}>
      <article onClick={(e) => e.stopPropagation()}>
        <header>
          <a
            href="#close"
            className="close"
            title="Lukk"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
          {entry.title || "Ingen tittel"} &nbsp;&ndash;&nbsp;{" "}
          <a className="no-wrap" href={entry.entryUri} target="_blank" rel="noreferrer noopener">
            Vis i data.norge.no <IconExternalLink />
          </a>
        </header>
        <p>
          <IconBuilding /> {entry.publisher}
        </p>
        <div className="description" dangerouslySetInnerHTML={{ __html: description }} />
        {entry.uri && (
          <p>
            <Uri uri={entry.uri} />
          </p>
        )}
        {!entry.keyword || !entry.keyword.length ? null : (
          <p>
            {entry.keyword.map((v: string, i: number) => (
              <span className="tag" key={i}>
                {v}
              </span>
            ))}
          </p>
        )}
        {formats && formats.length ? (
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
                        <a href={v.accessURL[0]} target="_blank" rel="noreferrer noopener">
                          Spesifikasjon
                        </a>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr key={i}>
                    <td>
                      <a
                        href={v.accessURL && v.accessURL.length ? v.accessURL[0] : entry.entryUri}
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
                    <td dangerouslySetInnerHTML={{ __html: toHtml(v.description) }}></td>
                  </tr>
                )
              )}
            </table>
          </p>
        ) : null}
      </article>
    </dialog>
  );
}
function Uri({ uri }: { uri: string }) {
  let domain = uri.match(/https?:\/\/([^/]+)/)?.[1];
  if (domain?.startsWith("www.")) domain = domain.slice(4);
  return (
    <a href={uri} target="_blank" rel="noreferrer noopener">
      {domain} <IconExternalLink />
    </a>
  );
}
