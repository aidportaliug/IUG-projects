import polyfloss from '../images/polyfloss.png';
import ventilation from '../images/ventilation.jpg';
import twigGrinder from '../images/shredder.png';
import shredder from '../images/machines/shredder.jpg';
import extruder from '../images/machines/extruder.jpg';
import compressionOven from '../images/machines/compression-oven.jpg';
import injectionMolding from '../images/machines/injection-molding-machine.jpg';
import ovenMelter from '../images/machines/oven-melter.jpg';
import grinderSoftPlastics from '../images/machines/grinder-soft-plastics.jpg';
import washingSystem from '../images/machines/washing-system.jpg';
import baler from '../images/machines/baler.jpg';

// Pictures of the machines, keyed by the machine name in the database (lower case).
// Source: EWB Norway's machine overview (picture_machiness_ewb.pdf); machines not listed show the default picture.
const machineImageByName: Record<string, string> = {
  shredder,
  extruder,
  'compression oven': compressionOven,
  'injection molding machine': injectionMolding,
  'oven/melter': ovenMelter,
  'grinder for soft plastics': grinderSoftPlastics,
  'washing and water cleaning system': washingSystem,
  baler,
  'twig grinder': twigGrinder,
  'ventilation system': ventilation,
  ventilation,
  polyfloss,
};

export function getMachineImage(name: string): string | undefined {
  return machineImageByName[name.trim().toLowerCase()];
}
