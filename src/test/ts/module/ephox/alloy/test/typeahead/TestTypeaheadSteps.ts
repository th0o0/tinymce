import { Assertions, Chain, FocusTools, Logger, UiControls, UiFinder, Waiter, Step } from '@ephox/agar';
import { Focus, Value } from '@ephox/sugar';
import { AlloyComponent } from 'ephox/alloy/api/component/ComponentApi';
import { GuiSystem } from 'ephox/alloy/api/system/Gui';
import { SugarDocument } from 'ephox/alloy/alien/TypeDefinitions';
import { AlloyTriggers, NativeEvents } from 'ephox/alloy/api/Main';
import { HTMLInputElement } from '@ephox/dom-globals';

export default (doc: SugarDocument, gui: GuiSystem, typeahead: AlloyComponent) => {
  const sWaitForMenu = (label: string) => {
    return Logger.t(
      label,
      Waiter.sTryUntil(
        'Waiting for menu to appear',
        UiFinder.sExists(gui.element(), '.selected-menu'),
        100,
        4000
      )
    );
  };

  const sAssertTextSelection = (label: string, start: number, finish: number) => {
    return Logger.t(
      label + ' sAssertTextSelection',
      Step.sync(() => {
        const node = typeahead.element().dom() as HTMLInputElement;
        Assertions.assertEq(label + ' start cursor', start, node.selectionStart);
        Assertions.assertEq(label + ' finish cursor', finish, node.selectionEnd);
      })
    )
  }

  const sTriggerInputEvent = (label: string) => {
    return Logger.t(
      label + ' sTriggerInputEvent',
      Step.sync(() => {
        AlloyTriggers.emit(typeahead, NativeEvents.input());
      })
    );
  };

  const sWaitForNoMenu = (label: string) => {
    return Logger.t(
      label,
      Waiter.sTryUntil(
        'Waiting for menu to go away',
        UiFinder.sNotExists(gui.element(), '.selected-menu'),
        100,
        1000
      )
    );
  };

  const sAssertFocusOnTypeahead = (label: string) => {
    return Logger.t(
      label,
      FocusTools.sTryOnSelector(
        'Focus should be on typeahead',
        doc,
        'input'
      )
    );
  };

  const sAssertValue = (label: string, expected: string) => {
    return Logger.t(
      label + ' sAssertValue',
      Chain.asStep(typeahead.element(), [
        Chain.mapper(Value.get),
        Assertions.cAssertEq('Checking value of typeahead', expected)
      ])
    );
  };

  return {
    sWaitForMenu,
    sWaitForNoMenu,
    sAssertTextSelection,
    sAssertFocusOnTypeahead,
    sTriggerInputEvent,
    sAssertValue
  };
};