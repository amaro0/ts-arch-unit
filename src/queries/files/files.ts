import { bootstrap } from "../../index";
import { Token } from "../../types";

interface IFiles {
  that(): this;

  haveMatchingName(token: Token): this;

  shouldExist(): this;
}

export const files = (): IFiles => {
  const projectMetaCrawler = bootstrap();
  let validFiles = Array.from(projectMetaCrawler.sourceFiles);

  return {
    that(): IFiles {
      return this;
    },
    haveMatchingName(token: Token): IFiles {
      if (typeof token === "string") {
        validFiles = validFiles.filter((f) => f.getBaseName() === token);
        return this;
      }

      validFiles = validFiles.filter((f) => token.test(f.getBaseName()));
      return this;
    },
    shouldExist(): IFiles {
      if (!validFiles.length) throw new Error("No file exist");

      return this;
    }
  };
};