import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

const generator = new PluginMetadataGenerator();
generator.generate({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  visitors: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname }),
  ],
  outputDir: __dirname,
  watch: true,
  tsconfigPath: 'tsconfig.json',
});
