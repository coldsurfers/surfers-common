import React, { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { MODAL_PORTAL_ID } from '../constants'

export const ModalPortal = ({ children }: PropsWithChildren<{}>) =>
  createPortal(children, document.getElementById(MODAL_PORTAL_ID)!)

ModalPortal.Pillar = () => <div id={MODAL_PORTAL_ID} />
