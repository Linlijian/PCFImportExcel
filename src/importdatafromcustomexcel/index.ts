import {IInputs, IOutputs} from "./generated/ManifestTypes";
import "./js/jquery.js";
import "./js/xlsx.full.min.js";
const XLSX = require('xlsx');
import * as $ from 'jquery';

export class importdatafromcustomexcel implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private button: HTMLButtonElement; //new
	private _excelUploadinput: HTMLInputElement;
	private _paragraphinput: HTMLLabelElement;
	private _notifyOutputChanged: () => void;
	private _container: HTMLDivElement;
	private _upload_complete: boolean;
	private _upload_size: number;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._excelUploadinput = document.createElement("input");
		this._excelUploadinput.id = "fileUploader";
		this._excelUploadinput.type="file" ;
		this._excelUploadinput.name="fileUploader" ;
		this._excelUploadinput.accept=".xls, .xlsx";
		this._excelUploadinput.style.opacity = "1";
		this._excelUploadinput.style.width = "auto";
		this._excelUploadinput.style.height = "auto";
		this._excelUploadinput.style.pointerEvents = "all";
		this._excelUploadinput.style.display = "none";

		//new 
		// Add control initialization code
		this.button = document.createElement("button");
		// Get the localized string from localized string
		if (context.parameters.ButtonText.raw) {
			this.button.innerHTML = context.parameters.ButtonText.raw;
		}
		//this.button.classList.add("SimpleIncrement_Button_Style");
		this.button.classList.add("pkButtonImport");
		this.button.setAttribute("id", "pk_btn_import");
		//if(context.parameters.BackgroundColor.raw){
		//	this.button.style.backgroundColor = context.parameters.BackgroundColor.raw;
		//}; 
		if (context.parameters.TextColor.raw) {
			this.button.style.color = context.parameters.TextColor.raw;
		};
		if (context.parameters.TextSize.raw) {
			this.button.style.fontSize = context.parameters.TextSize.raw;
		};
		if (context.parameters.Font.raw) {
			this.button.style.fontFamily = context.parameters.Font.raw;
		};

		if (context.parameters.pkBorderRadius.raw) {
			this.button.style.borderRadius = context.parameters.pkBorderRadius.raw;;
		};
		if (context.parameters.pkPaddingRight.raw) {
			this.button.style.paddingRight = context.parameters.pkPaddingRight.raw;;
		};

		this.button.style.textAlign = "right";
		//end new

		this._notifyOutputChanged = notifyOutputChanged;

		//mew
		this.button.addEventListener("click", this.onButtonImportClick.bind(this));
		this.button.style.width = container.style.width;
		if (context.parameters.ButtonHeight.raw) {
			this.button.style.height = context.parameters.ButtonHeight.raw + "px";
		};

		//this.button.addEventListener("click", (event) => { this._value = this._value + 1; this._notifyOutputChanged();});
		this._excelUploadinput.addEventListener("change", this.excelupdated.bind(this));
		this._excelUploadinput.addEventListener("click", this.excelupdated.bind(this));
		this._container = document.createElement("div");
		this._container.appendChild(this._excelUploadinput);

		this._paragraphinput = document.createElement("label");
		this._paragraphinput.id="jsonObject";
		this._paragraphinput.style.display = "none";

		this._container.appendChild(this._paragraphinput);
		this._container.appendChild(this.button);
		container.appendChild(this._container);


		this._upload_size = 0;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		if (context.parameters.ButtonText.raw) {
			this.button.innerHTML = context.parameters.ButtonText.raw;
		};
		//if(context.parameters.BackgroundColor.raw){
		//	this.button.style.backgroundColor = context.parameters.BackgroundColor.raw;
		//}; 
		if (context.parameters.TextColor.raw) {
			this.button.style.color = context.parameters.TextColor.raw;
		};
		if (context.parameters.TextSize.raw) {
			this.button.style.fontSize = context.parameters.TextSize.raw;
		};
		if (context.parameters.Font.raw) {
			this.button.style.fontFamily = context.parameters.Font.raw;
		};
		if (context.parameters.ButtonHeight.raw) {
			this.button.style.height = context.parameters.ButtonHeight.raw + "px";
		};

		if (context.parameters.pkBorderRadius.raw) {
			this.button.style.borderRadius = context.parameters.pkBorderRadius.raw;;
		};
		if (context.parameters.pkPaddingRight.raw) {
			this.button.style.paddingRight = context.parameters.pkPaddingRight.raw;;
		};
	}

	private onButtonImportClick(event: Event): void {
		//clear file upload
		(<HTMLInputElement>document.getElementById('fileUploader')).value = "";
		document.getElementById("jsonObject").innerHTML = ""
			;
		//click upload file
		$("#fileUploader").click();
	}

	private excelupdated(event: Event): void {
		$("#fileUploader").change(function (evt) {
			var selectedFile = (<HTMLInputElement>document.getElementById('fileUploader')).files[0];;
			var reader = new FileReader();
			reader.onload = function (event) {
				var data = event.target.result;
				var workbook = XLSX.read(data, {
					type: 'binary'
				});

				var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
				var json_object = JSON.stringify(XL_row_object);
				document.getElementById("jsonObject").innerHTML = json_object;

				// old
				//workbook.SheetNames.forEach(function (sheetName: string) {
				//	var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				//	var json_object = JSON.stringify(XL_row_object);
				//	document.getElementById("jsonObject").innerHTML = json_object;
				//})
			};

			reader.onerror = function (event) {
				console.error("File could not be read! Code " + event.target.error.code);
			};
			//https://codepen.io/NikhilKumaran/project/editor/AOjQYm	
			//http://spin.js.org/
			reader.readAsBinaryString(selectedFile);
		});
		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			Output: document.getElementById("jsonObject").innerHTML,
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}