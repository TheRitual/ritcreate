declare const Deno:
  | {
      args: string[];
      cwd(): string;
      makeTempDir(opts?: { prefix?: string }): Promise<string>;
      writeTextFile(path: string, content: string): Promise<void>;
      mkdir(path: string, opts: { recursive: boolean }): Promise<void>;
      writeFile(path: string, data: Uint8Array): Promise<void>;
      remove(path: string, opts: { recursive: boolean }): Promise<void>;
      exit(code: number): never;
      Command: new (cmd: string, opts: {
        args: string[];
        cwd: string;
        stdin: string;
        stdout: string;
        stderr: string;
      }) => { spawn(): { status: Promise<{ success: boolean; code: number | null }> } };
    }
  | undefined;
