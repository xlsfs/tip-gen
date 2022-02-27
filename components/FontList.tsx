import * as React from "react";
import SelectUnstyled, {
    SelectUnstyledProps,
    selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, {optionUnstyledClasses} from '@mui/base/OptionUnstyled';
import {styled} from '@mui/system';
import {PopperUnstyled} from '@mui/base';
import {FontMgr} from "../src/manager/FontMgr";
import {EventMgr} from "../src/manager/EventMgr";
import {EventEnum} from "../src/events/EventEnum";
import {Basic} from "../src/Basic";

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
        return (
            <CustomSelect
                value={this.state.selVal}
                onChange={(val) => {
                    this.setState({
                        selVal: val
                    });
                    this.props.onChange(val as any);
                }}>
                {this.state.prop_txt_font.map((c: any) => (
                    <StyledOption key={c.font} value={c.font}>
                        <span style={{
                            fontFamily: c.font
                        }}>{c.cn}</span>
                    </StyledOption>
                ))}
            </CustomSelect>
        )
    }
}

const CustomSelect = React.forwardRef(function CustomSelect(
    props: SelectUnstyledProps<number>,
    ref: React.ForwardedRef<any>,
) {
    const components: SelectUnstyledProps<number>['components'] = {
        Root: StyledButton,
        Listbox: StyledListbox,
        Popper: StyledPopper,
        ...props.components,
    };

    return <SelectUnstyled {...props} ref={ref} components={components}/>;
});

const StyledButton = styled('button')`
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

  &.${selectUnstyledClasses.focusVisible} {
    outline: 4px solid rgba(100, 100, 100, 0.3);
  }

  &.${selectUnstyledClasses.expanded} {
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

const StyledListbox = styled('ul')`
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

const StyledOption = styled(OptionUnstyled)`
  list-style: none;
  padding: 4px 10px;
  margin: 0;
  border-bottom: 1px solid #ddd;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.disabled} {
    color: #888;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: rgba(25, 118, 210, 0.08);
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: #16d;
    color: #fff;
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: #05e;
    color: #fff;
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: #39e;
  }

  & img {
    margin-right: 10px;
  }
`;

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;
