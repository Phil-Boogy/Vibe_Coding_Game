'use client';

import Modal from './Modal';
import Tile from './Tile';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play">
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p className="text-sm">
          Guess the WORDLE in 6 tries. After each guess, the color of the tiles
          will change to show how close your guess was to the word.
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          <div>
            <p className="font-bold mb-2">Examples</p>

            <div className="mb-3">
              <div className="flex gap-1 mb-2">
                <Tile letter="W" state="correct" position={0} />
                <Tile letter="E" state="empty" position={1} />
                <Tile letter="A" state="empty" position={2} />
                <Tile letter="R" state="empty" position={3} />
                <Tile letter="Y" state="empty" position={4} />
              </div>
              <p className="text-sm">
                The letter <strong>W</strong> is in the word and in the correct spot.
              </p>
            </div>

            <div className="mb-3">
              <div className="flex gap-1 mb-2">
                <Tile letter="P" state="empty" position={0} />
                <Tile letter="I" state="present" position={1} />
                <Tile letter="L" state="empty" position={2} />
                <Tile letter="L" state="empty" position={3} />
                <Tile letter="S" state="empty" position={4} />
              </div>
              <p className="text-sm">
                The letter <strong>I</strong> is in the word but in the wrong spot.
              </p>
            </div>

            <div className="mb-3">
              <div className="flex gap-1 mb-2">
                <Tile letter="V" state="empty" position={0} />
                <Tile letter="A" state="empty" position={1} />
                <Tile letter="G" state="empty" position={2} />
                <Tile letter="U" state="absent" position={3} />
                <Tile letter="E" state="empty" position={4} />
              </div>
              <p className="text-sm">
                The letter <strong>U</strong> is not in the word in any spot.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="font-bold text-center">
              A new puzzle is available each day!
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
