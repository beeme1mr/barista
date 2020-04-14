/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { grey } from 'chalk';
import { execSync } from 'child_process';
import { options } from 'yargs';
import { affectedArgs } from './affected-args';
import { getAffectedProjects, splitArrayIntoChunks } from './util';

/**
 * options to pass to the script:
 * --target <the nx workspace target>
 * --configuration <the configuration>
 * --withDeps
 */
export async function runParallel(): Promise<string> {
  const { CIRCLE_NODE_INDEX = '0', CIRCLE_NODE_TOTAL = '4' } = process.env;
  const currentNode = parseInt(CIRCLE_NODE_INDEX, 10);
  const totalNodes = parseInt(CIRCLE_NODE_TOTAL, 10);

  const {
    target,
    configuration,
    withDeps,
    parallel,
    increasedMemory,
  } = options({
    target: { type: 'string', alias: 't', demandOption: true },
    configuration: { type: 'string', alias: 'c' },
    exclude: { type: 'string', alias: 'e' },
    parallel: { type: 'boolean', default: true, alias: 'p' },
    withDeps: { type: 'boolean', alias: 'd' },
    increasedMemory: { type: 'number', alias: 'm' },
  }).argv;

  const baseSha = await affectedArgs();
  const projects = getAffectedProjects(baseSha, target);
  const chunkSize = Math.floor(projects.length / totalNodes);
  // split the projects into chunks
  const chunks = splitArrayIntoChunks(projects, chunkSize);
  const currentChunk = chunks[currentNode].join(',');

  const flags = [
    `--target="${target}"`,
    `--projects="${currentChunk}"`,
    '--skip-nx-cache',
  ];

  if (parallel) {
    flags.push(`--parallel`);
  }

  if (configuration) {
    flags.push(`--configuration="${configuration}"`);
  }

  if (withDeps) {
    flags.push(`--with-deps`);
  }

  const baseCommand = ['node'];

  if (increasedMemory) {
    baseCommand.push(`--max_old_space_size=${increasedMemory}`);
  }

  baseCommand.push('./node_modules/.bin/nx run-many');

  const command = [...baseCommand, ...flags];

  console.log(
    `---------------------------------------------------------------\n` +
      ` $ ${grey(command.join(' / \n\t'))}\n\n` +
      `---------------------------------------------------------------\n` +
      ``,
  );

  return command.join(' ');
}

// if filename is set the file is executed via an import or require.
// This should only run on direct execution with nodejs.
if (!require.main?.filename) {
  runParallel()
    .then((command: string) => {
      execSync(command, { stdio: [0, 1, 2] });
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
