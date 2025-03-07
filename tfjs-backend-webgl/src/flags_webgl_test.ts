/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import * as tf from '@tensorflow/tfjs-core';
import {device_util} from '@tensorflow/tfjs-core';
// tslint:disable-next-line: no-imports-from-dist
import {describeWithFlags} from '@tensorflow/tfjs-core/dist/jasmine_util';

import {WEBGL_ENVS} from './backend_webgl_test_registry';
import * as canvas_util from './canvas_util';
import {forceHalfFloat, webgl_util} from './webgl';

describe('WEBGL_FORCE_F16_TEXTURES', () => {
  afterAll(() => tf.env().reset());

  it('can be activated via forceHalfFloat utility', () => {
    forceHalfFloat();
    expect(tf.env().getBool('WEBGL_FORCE_F16_TEXTURES')).toBe(true);
  });

  it('turns off WEBGL_RENDER_FLOAT32_ENABLED', () => {
    tf.env().reset();
    forceHalfFloat();
    expect(tf.env().getBool('WEBGL_RENDER_FLOAT32_ENABLED')).toBe(false);
  });
});

const RENDER_FLOAT32_ENVS = {
  flags: {'WEBGL_RENDER_FLOAT32_CAPABLE': true},
  predicate: WEBGL_ENVS.predicate
};

const RENDER_FLOAT16_ENVS = {
  flags: {'WEBGL_RENDER_FLOAT32_CAPABLE': false},
  predicate: WEBGL_ENVS.predicate
};

describeWithFlags('WEBGL_RENDER_FLOAT32_CAPABLE', RENDER_FLOAT32_ENVS, () => {
  beforeEach(() => {
    tf.env().reset();
  });

  afterAll(() => tf.env().reset());

  it('should be independent of forcing f16 rendering', () => {
    forceHalfFloat();
    expect(tf.env().getBool('WEBGL_RENDER_FLOAT32_CAPABLE')).toBe(true);
  });

  it('if user is not forcing f16, device should render to f32', () => {
    expect(tf.env().getBool('WEBGL_RENDER_FLOAT32_ENABLED')).toBe(true);
  });
});

describeWithFlags('WEBGL_RENDER_FLOAT32_CAPABLE', RENDER_FLOAT16_ENVS, () => {
  beforeEach(() => {
    tf.env().reset();
  });

  afterAll(() => tf.env().reset());

  it('should be independent of forcing f16 rendering', () => {
    forceHalfFloat();
    expect(tf.env().getBool('WEBGL_RENDER_FLOAT32_CAPABLE')).toBe(false);
  });

  it('should be reflected in WEBGL_RENDER_FLOAT32_ENABLED', () => {
    expect(tf.env().getBool('WEBGL_RENDER_FLOAT32_ENABLED')).toBe(false);
  });
});

describe('HAS_WEBGL', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('false when version is 0', () => {
    tf.env().set('WEBGL_VERSION', 0);
    expect(tf.env().getBool('HAS_WEBGL')).toBe(false);
  });

  it('true when version is 1', () => {
    tf.env().set('WEBGL_VERSION', 1);
    expect(tf.env().getBool('HAS_WEBGL')).toBe(true);
  });

  it('true when version is 2', () => {
    tf.env().set('WEBGL_VERSION', 2);
    expect(tf.env().getBool('HAS_WEBGL')).toBe(true);
  });
});

describe('WEBGL_PACK', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when HAS_WEBGL is true', () => {
    tf.env().set('HAS_WEBGL', true);
    expect(tf.env().getBool('WEBGL_PACK')).toBe(true);
  });

  it('false when HAS_WEBGL is false', () => {
    tf.env().set('HAS_WEBGL', false);
    expect(tf.env().getBool('WEBGL_PACK')).toBe(false);
  });
});

describe('WEBGL_PACK_NORMALIZATION', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_NORMALIZATION')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_NORMALIZATION')).toBe(false);
  });
});

describe('WEBGL_PACK_CLIP', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_CLIP')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_CLIP')).toBe(false);
  });
});

describe('WEBGL_PACK_DEPTHWISECONV', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_DEPTHWISECONV')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_DEPTHWISECONV')).toBe(false);
  });
});

describe('WEBGL_PACK_BINARY_OPERATIONS', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_BINARY_OPERATIONS')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_BINARY_OPERATIONS')).toBe(false);
  });
});

describe('WEBGL_PACK_ARRAY_OPERATIONS', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_ARRAY_OPERATIONS')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_ARRAY_OPERATIONS')).toBe(false);
  });
});

describe('WEBGL_PACK_IMAGE_OPERATIONS', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_IMAGE_OPERATIONS')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_IMAGE_OPERATIONS')).toBe(false);
  });
});

describe('WEBGL_PACK_REDUCE', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_PACK_REDUCE')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_PACK_REDUCE')).toBe(false);
  });
});

describe('WEBGL_LAZILY_UNPACK', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_LAZILY_UNPACK')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_LAZILY_UNPACK')).toBe(false);
  });
});

describe('WEBGL_CONV_IM2COL', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    tf.env().set('WEBGL_PACK', true);
    expect(tf.env().getBool('WEBGL_CONV_IM2COL')).toBe(true);
  });

  it('false when WEBGL_PACK is false', () => {
    tf.env().set('WEBGL_PACK', false);
    expect(tf.env().getBool('WEBGL_CONV_IM2COL')).toBe(false);
  });
});

describe('WEBGL_MAX_TEXTURE_SIZE', () => {
  beforeEach(() => {
    tf.env().reset();
    webgl_util.resetMaxTextureSize();
    canvas_util.setWebGLContext(2, {
      MAX_TEXTURE_SIZE: 101,
      isContextLost: () => false,
      disable: (cap: number) => {},
      enable: (cap: number) => {},
      cullFace: (mode: number) => {},
      getParameter: (param: number) => {
        if (param === 101) {
          return 50;
        }
        throw new Error(`Got undefined param ${param}.`);
      }
    } as WebGLRenderingContext);
  });
  afterAll(() => {
    canvas_util.clearWebGLContext(2);
    tf.env().reset();
    webgl_util.resetMaxTextureSize();
  });

  it('is a function of gl.getParameter(MAX_TEXTURE_SIZE)', () => {
    expect(tf.env().getNumber('WEBGL_MAX_TEXTURE_SIZE')).toBe(50);
  });
});

describe('WEBGL_MAX_TEXTURES_IN_SHADER', () => {
  let maxTextures: number;
  beforeEach(() => {
    tf.env().reset();
    webgl_util.resetMaxTexturesInShader();

    canvas_util.setWebGLContext(2, {
      MAX_TEXTURE_IMAGE_UNITS: 101,
      isContextLost: () => false,
      disable: (cap: number) => {},
      enable: (cap: number) => {},
      cullFace: (mode: number) => {},
      getParameter: (param: number) => {
        if (param === 101) {
          return maxTextures;
        }
        throw new Error(`Got undefined param ${param}.`);
      }
    } as WebGLRenderingContext);
  });
  afterAll(() => {
    canvas_util.clearWebGLContext(2);
    tf.env().reset();
    webgl_util.resetMaxTexturesInShader();
  });

  it('is a function of gl.getParameter(MAX_TEXTURE_IMAGE_UNITS)', () => {
    maxTextures = 10;
    expect(tf.env().getNumber('WEBGL_MAX_TEXTURES_IN_SHADER')).toBe(10);
  });

  it('is capped at 16', () => {
    maxTextures = 20;
    expect(tf.env().getNumber('WEBGL_MAX_TEXTURES_IN_SHADER')).toBe(16);
  });
});

describe('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', () => {
  beforeEach(() => {
    tf.env().reset();
    device_util.mockIsMobile(undefined);
  });
  afterAll(() => {
    tf.env().reset();
    device_util.mockIsMobile(undefined);
  });

  it('disjoint query timer disabled', () => {
    tf.env().set('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', 0);

    expect(tf.env().getBool('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
        .toBe(false);
  });

  it('disjoint query timer enabled, mobile', () => {
    tf.env().set('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', 1);
    device_util.mockIsMobile(true);

    expect(tf.env().getBool('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
        .toBe(false);
  });

  it('disjoint query timer enabled, not mobile', () => {
    tf.env().set('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', 1);
    device_util.mockIsMobile(false);

    expect(tf.env().getBool('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
        .toBe(true);
  });
});

describe('WEBGL_SIZE_UPLOAD_UNIFORM', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('is 0 when there is no float32 bit support', () => {
    tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', false);
    expect(tf.env().getNumber('WEBGL_SIZE_UPLOAD_UNIFORM')).toBe(0);
  });

  it('is > 0 when there is float32 bit support', () => {
    tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);
    expect(tf.env().getNumber('WEBGL_SIZE_UPLOAD_UNIFORM')).toBeGreaterThan(0);
  });
});

describeWithFlags('WEBGL_DELETE_TEXTURE_THRESHOLD', WEBGL_ENVS, () => {
  it('should throw an error if given a negative value', () => {
    expect(() => tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', -2)).toThrow();
  });
});

describeWithFlags('WEBGL_FLUSH_THRESHOLD', WEBGL_ENVS, () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('should return the correct default value', () => {
    if (device_util.isMobile()) {
      expect(tf.env().getNumber('WEBGL_FLUSH_THRESHOLD')).toEqual(1);
    } else {
      expect(tf.env().getNumber('WEBGL_FLUSH_THRESHOLD')).toEqual(-1);
    }
  });
  it('should throw an error if given a negative value', () => {
    expect(() => tf.env().set('WEBGL_FLUSH_THRESHOLD', -2)).toThrow();
  });
});

describe('CPU_HANDOFF_SIZE_THRESHOLD', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('returns correct value when CPU_HANDOFF_SIZE_THRESHOLD is set', () => {
    tf.env().set('CPU_HANDOFF_SIZE_THRESHOLD', 256);
    expect(tf.env().getNumber('CPU_HANDOFF_SIZE_THRESHOLD')).toBe(256);
  });

  it('returns default when WEBGL_PACK is not set', () => {
    expect(tf.env().getNumber('CPU_HANDOFF_SIZE_THRESHOLD')).toBe(128);
  });
});

const LAST_DIM_FLAG = 'TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD';

describeWithFlags(LAST_DIM_FLAG, WEBGL_ENVS, () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it(`returns correct value when ${LAST_DIM_FLAG} is set`, () => {
    tf.env().set(LAST_DIM_FLAG, 256);
    expect(tf.env().getNumber(LAST_DIM_FLAG)).toBe(256);
  });

  it(`returns default when ${LAST_DIM_FLAG} is not set`, () => {
    expect(tf.env().getNumber(LAST_DIM_FLAG)).toBe(100000);
  });
});

const K_FLAG = 'TOPK_K_CPU_HANDOFF_THRESHOLD';

describeWithFlags(K_FLAG, WEBGL_ENVS, () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it(`returns correct value when ${K_FLAG} is set`, () => {
    tf.env().set(K_FLAG, 256);
    expect(tf.env().getNumber(K_FLAG)).toBe(256);
  });

  it(`returns default when ${K_FLAG} is not set`, () => {
    expect(tf.env().getNumber(K_FLAG)).toBe(128);
  });
});

describe('WEBGL_EXP_CONV', () => {
  beforeEach(() => tf.env().reset());
  afterAll(() => tf.env().reset());

  it('true when WEBGL_PACK is true', () => {
    expect(tf.env().getBool('WEBGL_EXP_CONV')).toBe(false);
  });
});
