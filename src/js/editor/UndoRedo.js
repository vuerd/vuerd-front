import JSLog from '../JSLog'
import UndoManager from 'undo-manager'

/**
 * undo, redo
 */
class UndoRedo {
  constructor () {
    JSLog('module loaded', 'UndoRedo')
    this.historys = {}
    this.callback = null

    this.undoJson = {
      draggable: null,
      draw: null
    }
  }

  // 종속성 초기화
  init (core) {
    JSLog('module dependency init', 'UndoRedo')
    this.core = core
  }

  // 각 모델별 undo, redo 매니저
  getManager () {
    const id = this.core.erd.active().id
    if (this.historys[id] === undefined) {
      this.historys[id] = new UndoManager()
      this.historys[id].setCallback(this.callback)
      return this.getManager()
    } else {
      return this.historys[id]
    }
  }

  // undo, redo 추가
  add ({ undo, redo }) {
    this.getManager().add({
      undo: () => {
        this.core.erd.store().commit({
          type: 'importData',
          state: JSON.parse(undo)
        })
      },
      redo: () => {
        this.core.erd.store().commit({
          type: 'importData',
          state: JSON.parse(redo)
        })
      }
    })
  }

  // 이전
  undo () {
    this.getManager().undo()
  }
  // 앞전
  redo () {
    this.getManager().redo()
  }

  // undo 셋팅
  setUndo (type) {
    switch (type) {
      case 'draggable':
        this.undoJson.draggable = JSON.stringify(this.core.erd.store().state)
        break
      case 'draw':
        this.undoJson.draw = JSON.stringify(this.core.erd.store().state)
        break
    }
  }
}

export default new UndoRedo()