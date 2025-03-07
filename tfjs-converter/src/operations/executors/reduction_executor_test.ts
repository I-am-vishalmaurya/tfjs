/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 * =============================================================================
 */
// tslint:disable-next-line: no-imports-from-dist
import * as tfOps from '@tensorflow/tfjs-core/dist/ops/ops_for_converter';

import {ExecutionContext} from '../../executor/execution_context';
import * as reduction from '../op_list/reduction';
import {Node} from '../types';

import {executeOp} from './reduction_executor';
import {RecursiveSpy, spyOnAllFunctions} from './spy_ops';
import {createBoolAttr, createNumberAttr, createNumberAttrFromIndex, createTensorAttr, uncapitalize, validateParam} from './test_helper';

describe('reduction', () => {
  let node: Node;
  const input1 = [tfOps.scalar(1)];
  const context = new ExecutionContext({}, {}, {});
  let spyOps: RecursiveSpy<typeof tfOps>;
  let spyOpsAsTfOps: typeof tfOps;

  beforeEach(() => {
    spyOps = spyOnAllFunctions(tfOps);
    spyOpsAsTfOps = spyOps as unknown as typeof tfOps;
    node = {
      name: 'test',
      op: '',
      category: 'reduction',
      inputNames: ['input1'],
      inputs: [],
      inputParams: {x: createTensorAttr(0)},
      attrParams: {},
      children: []
    };
  });

  describe('executeOp', () => {
    (['Max', 'Mean', 'Min', 'Sum', 'All', 'Any', 'Prod'] as const )
        .forEach(op => {
          it('should call tfOps.' + op, () => {
            node.op = op;
            node.attrParams.keepDims = createBoolAttr(true);
            node.attrParams.axis = createNumberAttr(1);
            // TODO(mattsoulanille): Remove type assertions after TS4
            // tslint:disable-next-line no-any
            (spyOps[uncapitalize(op) as keyof typeof spyOps] as any)
              .and.returnValue({});
            executeOp(node, {input1}, context, spyOpsAsTfOps);

            // TODO(mattsoulanille): Remove type assertion after TS4
            expect(spyOps[uncapitalize(op) as keyof typeof spyOps])
                .toHaveBeenCalledWith(input1[0], 1, true);
          });
        });
    describe('ArgMax', () => {
      it('should call tfOps.argMax', () => {
        node.op = 'ArgMax';
        node.attrParams.keepDims = createBoolAttr(true);
        node.attrParams.axis = createNumberAttr(1);
        spyOps.argMax.and.returnValue({});
        executeOp(node, {input1}, context, spyOpsAsTfOps);

        expect(spyOps.argMax).toHaveBeenCalledWith(input1[0], 1);
      });
    });
    describe('ArgMin', () => {
      it('should call tfOps.argMin', () => {
        node.op = 'ArgMin';
        node.attrParams.keepDims = createBoolAttr(true);
        node.attrParams.axis = createNumberAttr(1);
        spyOps.argMin.and.returnValue({});
        executeOp(node, {input1}, context, spyOpsAsTfOps);

        expect(spyOps.argMin).toHaveBeenCalledWith(input1[0], 1);
      });
    });
    describe('Cumprod', () => {
      it('should call tfOps.cumprod', () => {
        node.op = 'Cumprod';
        node.attrParams.exclusive = createBoolAttr(true);
        node.attrParams.reverse = createBoolAttr(false);
        node.inputNames = ['input1', 'input2'];
        node.inputParams.axis = createNumberAttrFromIndex(1);
        const input2 = [tfOps.scalar(2)];
        executeOp(node, {input1, input2}, context, spyOpsAsTfOps);

        expect(spyOps.cumprod).toHaveBeenCalledWith(input1[0], 2, true, false);
      });
    });
    describe('Cumsum', () => {
      it('should call tfOps.cumsum', () => {
        node.op = 'Cumsum';
        node.attrParams.exclusive = createBoolAttr(true);
        node.attrParams.reverse = createBoolAttr(false);
        node.inputNames = ['input1', 'input2'];
        node.inputParams.axis = createNumberAttrFromIndex(1);
        const input2 = [tfOps.scalar(2)];
        executeOp(node, {input1, input2}, context, spyOpsAsTfOps);

        expect(spyOps.cumsum).toHaveBeenCalledWith(input1[0], 2, true, false);
      });
    });
    describe('Bincount', () => {
      it('should call tfOps.bincount', () => {
        node.op = 'Bincount';
        node.inputNames = ['input4', 'input3', 'input2'];
        node.inputParams.size = createNumberAttrFromIndex(1);
        node.inputParams.weights = createTensorAttr(2);
        const input4 = [tfOps.tensor1d([1, 1], 'int32')];
        const input3 = [tfOps.scalar(2)];
        const input2 = [tfOps.tensor1d([])];
        executeOp(node, {input4, input3, input2}, context, spyOpsAsTfOps);

        expect(spyOps.bincount).toHaveBeenCalledWith(input4[0], input2[0], 2);
      });
      it('should match json def for bincount.', () => {
        node.op = 'Bincount';
        node.inputParams.size = createNumberAttrFromIndex(1);
        node.inputParams.weights = createTensorAttr(2);

        expect(validateParam(node, reduction.json, 'Bincount')).toBeTruthy();
      });
    });
    describe('DenseBincount', () => {
      it('should call tfOps.denseBincount', () => {
        node.op = 'DenseBincount';
        node.inputNames = ['input4', 'input3', 'input2'];
        node.inputParams.x = createTensorAttr(0);
        node.inputParams.size = createNumberAttrFromIndex(1);
        node.inputParams.weights = createTensorAttr(2);
        node.attrParams.binaryOutput = createBoolAttr(true);
        const input4 = [tfOps.tensor1d([1, 1], 'int32')];
        const input3 = [tfOps.scalar(2)];
        const input2 = [tfOps.tensor1d([])];
        executeOp(node, {input4, input3, input2}, context, spyOpsAsTfOps);

        expect(spyOps.denseBincount)
            .toHaveBeenCalledWith(input4[0], input2[0], 2, true);
      });
      it('should match json def for denseBincount.', () => {
        node.op = 'DenseBincount';
        node.inputParams.size = createNumberAttrFromIndex(1);
        node.inputParams.weights = createTensorAttr(2);
        node.attrParams.binaryOutput = createBoolAttr(true);

        expect(validateParam(node, reduction.json, 'DenseBincount'))
            .toBeTruthy();
      });
    });
  });
});
