/** @jsx jsx */

import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types/views';
import { Button, ButtonGroup, ControlGroup, InputGroup, Tag, TextArea } from '@blueprintjs/core';
import React from 'react';


export function openLinkInBrowser(link: string) {
  // Some dance in an attempt to detect Electron without inadvertently including it in a bundle
  if (typeof require !== 'undefined' && require.resolveWeak !== undefined) {
    try {
      const el = __webpack_modules__[require.resolveWeak('electron') as number];
      if (el) {
        el.shell.openExternal(link);
      }
    } catch (e) {
      console.error("Unable to open link in default browser", link, e);
    }
  } else if (typeof window !== 'undefined') {
    try {
      window.location.assign(link);
    } catch (e) {
      console.error("Unable to navigate to link", link, e);
    }
  }
}



interface CodeData {
  code: string
  fieldcode: string
  groupcode?: string
  subgroupcode?: string

  context?: string // JSON-LD URL
  description: string
  descriptionFull: string
  relationships: { type: 'related', to: string /* UUID */, text?: string }[]
  notes: string[]
}


const code: ItemClassConfiguration<CodeData> = {
  meta: {
    title: "ICS code",
    description: "Represents a field, group, sub-group, or unit in the International Classification for Standards.",
    id: 'codes',
    alternativeNames: [],
  },
  defaults: {
    description: '',
    descriptionFull: '',
    relationships: [],
    notes: [],
  },
  itemSorter: (p1, p2) => (p1.code || '').localeCompare(p2.code || ''),
  sanitizePayload: async (p) => p,
  validatePayload: async () => true,

  views: {
    listItemView: ({ itemData, className }) =>
      <span className={className}>
        <code>{itemData.code}</code>
        &emsp;
        {itemData.description}
      </span>,
    detailView: ({ itemData, className, useRegisterItemData, getRelatedItemClassConfiguration }) => {
      const {
        fieldcode, groupcode, subgroupcode,
        context,
        description, descriptionFull,
        relationships, notes,
      } = itemData;
      return (
        <Wrapper className={className}>
          <PropertyDetailView title="Code">
            <ControlGroup fill>
              <InputGroup readOnly leftIcon={<Tag minimal>Field</Tag>} value={fieldcode} />
              <InputGroup readOnly leftIcon={<Tag minimal>Group</Tag>} value={groupcode || '—'} />
              <InputGroup readOnly leftIcon={<Tag minimal>Subgroup</Tag>} value={subgroupcode || '—'} />
            </ControlGroup>
          </PropertyDetailView>
          <PropertyDetailView title="Context">
            {context
              ? <a onClick={() => openLinkInBrowser(context)}>{context}</a>
              : '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Description">
            {description || '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Full description">
            {descriptionFull || '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Relationships">
            {relationships.map(r =>
              <div>
                <GenericRelatedItemView
                  useRegisterItemData={useRegisterItemData}
                  getRelatedItemClassConfiguration={getRelatedItemClassConfiguration}
                  itemRef={{ classID: 'codes', itemID: r.to }}
                />
                {r.text ? <p css={css`font-size: 80%; margin-top: .25rem;`}>{r.text}</p> : null}
              </div>
            )}
          </PropertyDetailView>
          <PropertyDetailView title="Notes">
            {(notes || []).map(n =>
              <div>
                <p css={css`margin-top: .25rem;`}>{n}</p>
              </div>
            )}
          </PropertyDetailView>
        </Wrapper>
      );
    },
    editView: ({ itemData, className, useRegisterItemData, getRelatedItemClassConfiguration, onChange }) => {
      const {
        fieldcode, groupcode, subgroupcode,
        context,
        description, descriptionFull,
        relationships, notes,
      } = itemData;

      function handleItemAddition<T extends 'notes' | 'relationships'>(field: T, makeNewItem: () => CodeData[T][number]) {
        return () => {
          if (!onChange) { return; }
          const items: CodeData[T] = (Array.isArray(itemData[field]) ? itemData[field] : []);
          onChange({ ...itemData, [field]: [...items, makeNewItem()] });
        };
      }

      function handleItemDeletion<T extends 'notes' | 'relationships'>(field: T) {
        return (idx: number) => {
          if (!onChange) { return; }
          var items: CodeData[T] = [...(itemData[field] ?? [])] as CodeData[T];
          items.splice(idx, 1);
          onChange({ ...itemData, [field]: items });
        };
      }

      const handleNoteAddition = handleItemAddition('notes', () => '');
      const handleNoteDeletion = handleItemDeletion('notes'); 

      function handleNoteChange(idx: number, note: string) {
        if (!onChange) { return; }
        const newNotes = [ ...notes ];
        newNotes[idx] = note;
        onChange({ ...itemData, notes: newNotes });
      }

      return (
        <Wrapper className={className}>
          <ButtonGroup css={css`margin-bottom: 1rem`}>
            <Button onClick={handleNoteAddition} icon="add">Note</Button>
          </ButtonGroup>

          <PropertyDetailView title="Code">
            <ControlGroup fill>
              <InputGroup readOnly={!onChange} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange!({ ...itemData, fieldcode: evt.currentTarget.value })} leftIcon={<Tag minimal>Field</Tag>} value={fieldcode ?? ''} />
              <InputGroup readOnly={!onChange} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange!({ ...itemData, groupcode: evt.currentTarget.value })} leftIcon={<Tag minimal>Group</Tag>} value={groupcode ?? ''} />
              <InputGroup readOnly={!onChange} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange!({ ...itemData, subgroupcode: evt.currentTarget.value })} leftIcon={<Tag minimal>Subgroup</Tag>} value={subgroupcode ?? ''} />
            </ControlGroup>
          </PropertyDetailView>
          <PropertyDetailView title="Context">
            {context
              ? <a onClick={() => openLinkInBrowser(context)}>{context}</a>
              : '—'}
          </PropertyDetailView>
          <PropertyDetailView title="Description">
            <TextArea fill value={description} disabled={!onChange} onChange={(evt) => onChange!({ ...itemData, description: evt.currentTarget.value })} />
          </PropertyDetailView>
          <PropertyDetailView title="Full description">
            <TextArea fill value={descriptionFull} disabled={!onChange} onChange={(evt) => onChange!({ ...itemData, descriptionFull: evt.currentTarget.value })} />
          </PropertyDetailView>

          <PropertyDetailView title="Relationships">
            {(relationships ?? []).map(r =>
              <div>
                <GenericRelatedItemView
                  useRegisterItemData={useRegisterItemData}
                  getRelatedItemClassConfiguration={getRelatedItemClassConfiguration}
                  itemRef={{ classID: 'codes', itemID: r.to }}
                />
                {r.text ? <p css={css`font-size: 80%; margin-top: .25rem;`}>{r.text}</p> : null}
              </div>
            )}
          </PropertyDetailView>

          {(notes ?? []).map((n, idx) =>
            <PropertyDetailView
                key={idx}
                title={`Note ${idx + 1}`}
                secondaryTitle={<Button icon="cross" onClick={() => handleNoteDeletion(idx)}>Delete note</Button>}>
              <TextArea
                value={n}
                fill
                disabled={!onChange}
                onChange={(evt) => handleNoteChange(idx, evt.currentTarget.value)}
              />
            </PropertyDetailView>
          )}
        </Wrapper>
      );
    },
  },
};


export const itemClassConfiguration = {
  codes: code,
};


const Wrapper = styled.div`
  position: absolute; top: 0rem; left: 0rem; right: 0rem; bottom: 0rem;
  overflow-y: auto;
  padding: 1rem;
`;
