import * as React from "react";
import {Select} from '@base-ui/react/select';
import {styled} from '@mui/system';
import {FontMgr} from "../src/manager/FontMgr";
import {EventMgr} from "../src/manager/EventMgr";
import {EventEnum} from "../src/events/EventEnum";
import {Basic} from "../src/Basic";
import {useTranslation} from "next-i18next/pages";

export default class FontList extends React.Component<{
    selVal: string,
    onChange: (val: string) => void
}> {

    state: any;

    constructor(props: any) {
        super(props);
        this.state = {
            prop_txt_font: FontMgr.getIns().getFonts(),
            selVal: props.selVal
        };

        EventMgr.getIns().removeByCaller(EventEnum.changeFontFamily, Basic.EventObj_fontList);
        EventMgr.getIns().add(EventEnum.changeFontFamily, (font: string) => {
            if(this.state.selVal != font) {
                this.setState({selVal: font});
            }
        }, Basic.EventObj_fontList);
    }

    render() {
        let items = this.state.prop_txt_font.map((c: any) => ({
            label: c.cn,
            value: c.font,
        }));

        return (
            <CustomSelect
                items={items}
                value={this.state.selVal}
                onValueChange={(val) => {
                    this.setState({
                        selVal: val
                    });
                    this.props.onChange(val);
                }}
            >
                {this.state.prop_txt_font.map((c: any) => (
                    <StyledItem key={c.font} value={c.font}>
                        <Select.ItemText style={{
                            fontFamily: c.font
                        }}>{c.cn}</Select.ItemText>
                    </StyledItem>
                ))}
            </CustomSelect>
        )
    }
}

function CustomSelect(props: Select.Root.Props<string, false>) {
    const {t} = useTranslation('common');

    return (
        <Select.Root {...props}>
            <StyledTrigger aria-label={t("font")}>
                <Select.Value />
            </StyledTrigger>
            <Select.Portal>
                <StyledPositioner sideOffset={0} alignItemWithTrigger={false}>
                    <StyledPopup>
                        <StyledList>
                            {props.children}
                        </StyledList>
                    </StyledPopup>
                </StyledPositioner>
            </Select.Portal>
        </Select.Root>
    );
}

const StyledTrigger = styled(Select.Trigger)`
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-height: calc(1.5em);
  //min-width: 480px;
  background: #fff;
  border: 1px solid #ccc;
  //border-radius: 0.75em;
  margin: 0.5em;
  //padding: 10px;
  text-align: left;
  line-height: 1.5;
  color: #000;

  &:focus-visible {
    outline: 4px solid rgba(100, 100, 100, 0.3);
  }

  &[data-popup-open] {
    //border-radius: 0.75em 0.75em 0 0;

    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }

  & img {
    margin-right: 10px;
  }
`;

const StyledPositioner = styled(Select.Positioner)`
  z-index: 1;
`;

const StyledPopup = styled(Select.Popup)`
  background-color: #fff;
`;

const StyledList = styled(Select.List)`
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background-color: #fff;
  //min-width: 480px;
  border: 1px solid #ccc;
  border-top: none;
  color: #000;
  max-height: 400px;
  overflow: auto;
`;

const StyledItem = styled(Select.Item)`
  list-style: none;
  padding: 4px 10px;
  margin: 0;
  border-bottom: 1px solid #ddd;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &[data-disabled] {
    color: #888;
  }

  &[data-selected] {
    background-color: rgba(25, 118, 210, 0.08);
  }

  &[data-highlighted] {
    background-color: #16d;
    color: #fff;
  }

  &[data-highlighted][data-selected] {
    background-color: #05e;
    color: #fff;
  }

  &:hover:not([data-disabled]) {
    background-color: #39e;
  }

  & img {
    margin-right: 10px;
  }
`;
