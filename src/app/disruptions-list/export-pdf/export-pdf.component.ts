import { Component, Input } from '@angular/core';
import { ExportService } from '../export.service';
import { DisruptionsGridRowViewModel } from '../grid/disruptions-gridrow.viewmodel';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdftypes from 'pdfmake/interfaces';
import { ExportAllFieldsService } from '../export-all-fields.service';
import { EnumFormatter } from '../../shared/formatters/enum.formatter';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
	selector: 'dm-export-pdf',
	templateUrl: './export-pdf.component.html',
	styleUrls: ['./export-pdf.component.scss']
})
export class ExportPdfComponent {
	@Input() exportAllPdf: boolean;
	disruptionKeys = [];

	constructor(private exportService: ExportService, private exportAllFieldsService: ExportAllFieldsService) { }

	genDocDefinition(): pdftypes.TDocumentDefinitions {
		return {
			pageOrientation: 'landscape',
			content: {
				layout: 'lightHorizontalLines',
				fontSize: 10,
				table: {
					headerRows: 1,
					body: [...[this.genHeaders()], ...this.genData()]
				}
			}
		} as pdftypes.TDocumentDefinitions;
	}

	genAllFieldsDocDefinition(): pdftypes.TDocumentDefinitions {
		const pdfDefinition = {
			pageOrientation: 'portrait',
			content: [],
			footer(currentPage, pageCount) { return {
				margin: 10,
				columns: [
				{
					fontSize: 9,
					text: [
					{
					text: currentPage.toString() + ' of ' + pageCount,
					}
					],
					alignment: 'center'
				}
				]
			}; },
		};
		return this.allFieldsPdfContents(pdfDefinition) as pdftypes.TDocumentDefinitions;
	}

	private allFieldsPdfContents(pdfDefinition) {
		const pdfData = this.exportAllFieldsService.data.map(x => Object.assign({}, x));
		pdfData.forEach((data, dataIndex) => {
			pdfDefinition.content.push({ text: 'Disruption ' + (dataIndex + 1) + ' [' + data.title + ']', style: { bold: true, fontSize: 18 } });

			const arrImpacts = data.impacts;
			delete data.impacts;

			const arrSocialMessages = data.socialMessages;
			delete data.socialMessages;

			const arrValidityPeriods = data.validityPeriods;
			delete data.validityPeriods;

			if (this.disruptionKeys.length === 0) {
				this.disruptionKeys = Object.keys(data);
			}

			for (const key of this.disruptionKeys) {
				const value = data[key];
				if (value) {
					pdfDefinition.content.push({ text: '\n' + EnumFormatter.toPrettyString(key), bold: true }, { text: value });
				}
			}

			arrImpacts.forEach((impact, impactIndex) => {
				pdfDefinition.content.push({
					text: '\nImpact ' + (impactIndex + 1) + ' - ' + impact.mode + ' / '
						+ impact.type, style: { bold: true, fontSize: 16 }
				});

				for (const impactKey of this.exportAllFieldsService.impactFields) {
					const impactValue = impact[impactKey];
					if (impactValue) {
						pdfDefinition.content.push({ text: '\n' + EnumFormatter.toPrettyString(impactKey), bold: true }, { text: impactValue });
					}
				}
			});

			arrSocialMessages.forEach((social, socialIndex) => {
				pdfDefinition.content.push({ text: '\nSocial Message ' + (socialIndex + 1), style: { bold: true, fontSize: 16 } });
				for (const socialKey of this.exportAllFieldsService.socialFields) {
					const socialValue = social[socialKey];
					if (socialValue) {
						pdfDefinition.content.push({ text: '\n' + EnumFormatter.toPrettyString(socialKey), bold: true }, { text: socialValue });
					}
				}
			});


			arrValidityPeriods.forEach((validityPeriod, validityIndex) => {
				pdfDefinition.content.push({ text: '\nValidity Period ' + (validityIndex + 1), style: { bold: true, fontSize: 16 } });
				for (const validityKey of this.exportAllFieldsService.validityFields) {
					const validityValue = validityPeriod[validityKey];
					if (validityValue) {
						pdfDefinition.content.push({ text: '\n' + EnumFormatter.toPrettyString(validityKey), bold: true }, { text: validityValue });
					}
				}
			});



			pdfDefinition.content.push({ text: '', pageBreak: 'after' });
		});

		return pdfDefinition;
	}

	private transformData(disruption: DisruptionsGridRowViewModel) {
		return {
			id: disruption.id,
			title: disruption.title,
			mode: disruption.serviceModes,
			'operator wide': disruption.operatorWide ? 'yes' : 'no',
			'network wide': disruption.networkWide ? 'yes' : 'no',
			'services affected': disruption.servicesAffectedCount,
			'stops affected': disruption.stopsAffectedCount,
			start: disruption.startDate,
			end: disruption.endDate,
			severity: disruption.severity,
			live: disruption.isLive ? 'yes' : 'no',
			status: disruption.status,
		};
	}

	private genHeaders(): { text: string, bold: boolean }[] {
		/* Returns an array of objects used to define the header of the table
		   eg [{text: "key1", bold: true}, {text: "key2", bold: true}] */

		return Object.keys(this.transformData(this.exportService.data[0]))
			.map(item => (
				{
					text: item,
					bold: true,
				}
			));
	}

	private genData() {
		/* Returns export data in to a form pdfmake can understand,
		   ie converts [{key11: value11, key12:value12}, {key21: value21, key22: value22}]
		   to [[value11, value12], [value21, value22]]
		 */
		return this.exportService.data
			.map(disruption => Object.values(this.transformData(disruption)));
	}

	genPDF() {
		if (this.exportAllPdf) {
			pdfMake.createPdf(this.genAllFieldsDocDefinition()).download('disruptions_all_fields.pdf');
		} else {
			pdfMake.createPdf(this.genDocDefinition()).download('disruptions_list.pdf');
		}
	}
}
